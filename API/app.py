import os
import requests
import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

class AviationStackClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "http://api.aviationstack.com/v1"
    
    def _get_real_flight_data(self, flight_iata=None, flight_icao=None, flight_number=None):
        """
        获取真实航班数据
        """
        params = {
            'access_key': self.api_key,
        }
        
        # 根据提供的参数构建查询
        if flight_iata:
            params['flight_iata'] = flight_iata
        elif flight_icao:
            params['flight_icao'] = flight_icao
        elif flight_number:
            params['flight_number'] = flight_number
        else:
            return {"error": "必须提供航班标识符"}
        
        try:
            # 注意：AviationStack API 使用 GET 请求
            response = requests.get(f"{self.base_url}/flights", params=params)
            response.raise_for_status()
            
            data = response.json()
            
            print(f"=== DEBUG: API响应状态 ===")
            print(f"URL: {response.url}")
            print(f"状态码: {response.status_code}")
            
            if data.get('data') and len(data['data']) > 0:
                flight = data['data'][0]  # 取第一个结果
                print(f"找到航班数据: {flight.get('flight', {}).get('iata', '未知')}")
                
                # 打印完整的延误相关信息用于调试
                print("=== 延误相关数据 ===")
                print(f"出发延误: {flight.get('departure', {}).get('delay')}")
                print(f"出发计划: {flight.get('departure', {}).get('scheduled')}")
                print(f"实际出发: {flight.get('departure', {}).get('actual')}")
                print(f"到达延误: {flight.get('arrival', {}).get('delay')}")
                print(f"到达计划: {flight.get('arrival', {}).get('scheduled')}")
                print(f"实际到达: {flight.get('arrival', {}).get('actual')}")
                
                return self._format_flight_data(flight)
            else:
                print("=== DEBUG: 没有找到航班数据 ===")
                return {"error": "未找到航班数据"}
                
        except requests.exceptions.RequestException as e:
            print(f"=== DEBUG: 请求异常 ===")
            print(f"错误: {str(e)}")
            return {"error": f"API请求失败: {str(e)}"}
        except Exception as e:
            print(f"=== DEBUG: 处理数据异常 ===")
            print(f"错误: {str(e)}")
            import traceback
            traceback.print_exc()  # 打印完整堆栈跟踪
            return {"error": f"处理数据时出错: {str(e)}"}
    
    def _extract_delay_info(self, flight_data):
        """
        智能提取延误信息，尝试多种可能的字段和格式
        """
        departure = flight_data.get('departure', {})
        arrival = flight_data.get('arrival', {})
        
        # 尝试多种可能的延误字段名称
        departure_delay = self._try_multiple_delay_fields(departure)
        arrival_delay = self._try_multiple_delay_fields(arrival)
        
        # 如果直接延误字段没有找到，尝试从时间计算
        if departure_delay == 0:
            departure_delay = self._calculate_delay_from_times(
                departure.get('scheduled'),
                departure.get('actual') or departure.get('estimated')
            )
        
        if arrival_delay == 0:
            arrival_delay = self._calculate_delay_from_times(
                arrival.get('scheduled'),
                arrival.get('actual') or arrival.get('estimated')
            )
        
        return departure_delay, arrival_delay

    def _try_multiple_delay_fields(self, location_data):
        """
        尝试从多个可能的字段名称中提取延误信息
        """
        # 可能的延误字段名称
        delay_field_names = ['delay', 'delay_minutes', 'delay_time', 'departure_delay', 'arrival_delay']
        
        for field_name in delay_field_names:
            delay_value = location_data.get(field_name)
            if delay_value is not None:
                processed_delay = self._safe_int(delay_value)
                if processed_delay > 0:
                    print(f"DEBUG: 从字段 '{field_name}' 找到延误: {processed_delay} 分钟")
                    return processed_delay
        
        # 检查是否有包含延误信息的子字段
        for key, value in location_data.items():
            if isinstance(value, dict) and 'delay' in value:
                processed_delay = self._safe_int(value['delay'])
                if processed_delay > 0:
                    print(f"DEBUG: 从子字段 '{key}.delay' 找到延误: {processed_delay} 分钟")
                    return processed_delay
        
        return 0

    def _safe_int(self, value):
        """
        安全地将值转换为整数，处理None和其他异常
        """
        if value is None:
            return 0
        try:
            # 处理字符串形式的数字
            if isinstance(value, str):
                # 尝试提取数字部分
                import re
                numbers = re.findall(r'\d+', value)
                if numbers:
                    return int(numbers[0])
                else:
                    return 0
            return int(value)
        except (TypeError, ValueError):
            return 0
    
    def _format_flight_data(self, flight_data):
        """
        格式化航班数据以适应Chainlink需求
        """
        # 安全地提取数据，处理可能的None值
        formatted_data = {
            "flight_date": flight_data.get('flight_date', ''),
            "flight_status": flight_data.get('flight_status', ''),
            "departure_airport": flight_data.get('departure', {}).get('airport', ''),
            "departure_iata": flight_data.get('departure', {}).get('iata', ''),
            "departure_scheduled": flight_data.get('departure', {}).get('scheduled', ''),
            "departure_actual": flight_data.get('departure', {}).get('actual', ''),
            "departure_estimated": flight_data.get('departure', {}).get('estimated', ''),
            "arrival_airport": flight_data.get('arrival', {}).get('airport', ''),
            "arrival_iata": flight_data.get('arrival', {}).get('iata', ''),
            "arrival_scheduled": flight_data.get('arrival', {}).get('scheduled', ''),
            "arrival_actual": flight_data.get('arrival', {}).get('actual', ''),
            "arrival_estimated": flight_data.get('arrival', {}).get('estimated', ''),
            "airline_name": flight_data.get('airline', {}).get('name', ''),
            "flight_number": flight_data.get('flight', {}).get('number', ''),
            "flight_iata": flight_data.get('flight', {}).get('iata', ''),
            "flight_icao": flight_data.get('flight', {}).get('icao', '')
        }
        
        # 使用智能延误提取
        departure_delay, arrival_delay = self._extract_delay_info(flight_data)
        
        print(f"DEBUG - 最终延误结果: 出发={departure_delay}分钟, 到达={arrival_delay}分钟")
        
        # 安全地检查是否有延误
        is_delayed = departure_delay > 0 or arrival_delay > 0
        
        # 为智能合约准备简化数据
        simplified_data = {
            "is_delayed": is_delayed,
            "departure_delay_minutes": departure_delay,
            "arrival_delay_minutes": arrival_delay,
            "flight_status_code": self._status_to_code(formatted_data["flight_status"]),
            "timestamp": formatted_data["arrival_actual"] or formatted_data["arrival_estimated"] or 
                        formatted_data["departure_actual"] or formatted_data["departure_estimated"] or ""
        }
        
        return {
            "raw_data": formatted_data,
            "simplified": simplified_data
        }

    def _calculate_delay_from_times(self, scheduled_time, actual_time):
        """
        根据计划时间和实际时间计算延误分钟数
        """
        if not scheduled_time or not actual_time:
            return 0
        
        try:
            from datetime import datetime
            
            # 解析时间字符串
            scheduled = datetime.fromisoformat(scheduled_time.replace('Z', '+00:00'))
            actual = datetime.fromisoformat(actual_time.replace('Z', '+00:00'))
            
            # 计算时间差（分钟）
            delay_minutes = (actual - scheduled).total_seconds() / 60
            
            # 只返回正延误（晚点），提前到达不算延误
            return max(0, int(delay_minutes))
        
        except Exception as e:
            print(f"计算延误时间出错: {e}")
            return 0
    
    def _status_to_code(self, status):
        """将状态转换为数字代码"""
        status_codes = {
            "scheduled": 0,
            "active": 1,
            "landed": 2,
            "cancelled": 3,
            "incident": 4,
            "diverted": 5
        }
        return status_codes.get(status, 6)  # 6 表示未知状态

# 初始化客户端
api_key = os.getenv('AVIATIONSTACK_API_KEY')
if not api_key:
    raise ValueError("AVIATIONSTACK_API_KEY 环境变量未设置")

client = AviationStackClient(api_key)

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({"status": "healthy", "service": "chainlink-flight-adapter"})

@app.route('/flight', methods=['POST'])
def get_flight_info():
    """
    Chainlink 外部适配器端点
    期望的 POST 数据格式:
    {
        "id": "请求ID",
        "data": {
            "flight_iata": "LH123",  // 可选
            "flight_icao": "DLH123", // 可选  
            "flight_number": "123"   // 可选
        }
    }
    """
    try:
        # 解析请求数据
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({
                "jobRunID": request_data.get('id', 'unknown'),
                "status": "error",
                "error": "无效的JSON数据",
                "statusCode": 400
            })
        
        # 提取参数
        job_run_id = request_data.get('id', '1')
        data = request_data.get('data', {})
        
        flight_iata = data.get('flight_iata')
        flight_icao = data.get('flight_icao') 
        flight_number = data.get('flight_number')
        
        # 获取航班数据
        result = client.get_flight_data(
            flight_iata=flight_iata,
            flight_icao=flight_icao,
            flight_number=flight_number
        )
        
        # 返回 Chainlink 兼容的响应
        if "error" in result:
            return jsonify({
                "jobRunID": job_run_id,
                "status": "errored",
                "error": result["error"],
                "statusCode": 500
            })
        
        return jsonify({
            "jobRunID": job_run_id,
            "data": result,
            "statusCode": 200
        })
        
    except Exception as e:
        return jsonify({
            "jobRunID": request_data.get('id', 'unknown') if 'request_data' in locals() else 'unknown',
            "status": "errored", 
            "error": f"服务器错误: {str(e)}",
            "statusCode": 500
        })

@app.route('/flight/delayed', methods=['POST'])
def check_flight_delay():
    """
    专门检查航班延误的端点
    返回格式化的延误信息，便于智能合约处理
    """
    try:
        request_data = request.get_json()
        job_run_id = request_data.get('id', '1')
        data = request_data.get('data', {})
        
        flight_iata = data.get('flight_iata')
        flight_icao = data.get('flight_icao')
        flight_number = data.get('flight_number')
        
        result = client.get_flight_data(
            flight_iata=flight_iata,
            flight_icao=flight_icao, 
            flight_number=flight_number
        )
        
        if "error" in result:
            return jsonify({
                "jobRunID": job_run_id,
                "status": "errored",
                "error": result["error"],
                "statusCode": 500
            })
        
        simplified = result["simplified"]
        
        # 为智能合约返回简化数据
        return jsonify({
            "jobRunID": job_run_id,
            "data": {
                "isDelayed": simplified["is_delayed"],
                "departureDelay": simplified["departure_delay_minutes"],
                "arrivalDelay": simplified["arrival_delay_minutes"], 
                "statusCode": simplified["flight_status_code"],
                "timestamp": simplified["timestamp"]
            },
            "statusCode": 200
        })
        
    except Exception as e:
        return jsonify({
            "jobRunID": request_data.get('id', 'unknown') if 'request_data' in locals() else 'unknown',
            "status": "errored",
            "error": str(e),
            "statusCode": 500
        })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)