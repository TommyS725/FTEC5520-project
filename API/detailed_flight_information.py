import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def debug_flight_data(flight_iata):
    api_key = os.getenv('AVIATIONSTACK_API_KEY')
    base_url = "http://api.aviationstack.com/v1/flights"
    
    params = {
        'access_key': api_key,
        'flight_iata': flight_iata
    }
    
    try:
        response = requests.get(base_url, params=params)
        print(f"=== 调试航班 {flight_iata} ===")
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('data') and len(data['data']) > 0:
                flight = data['data'][0]
                
                # 打印完整的航班信息
                print("\n--- 完整航班数据 ---")
                print(json.dumps(flight, indent=2, ensure_ascii=False))
                
                # 特别关注延误相关字段
                print("\n--- 延误相关字段 ---")
                departure = flight.get('departure', {})
                arrival = flight.get('arrival', {})
                
                print("出发信息:")
                print(f"  延误: {departure.get('delay')}")
                print(f"  计划: {departure.get('scheduled')}")
                print(f"  预计: {departure.get('estimated')}")
                print(f"  实际: {departure.get('actual')}")
                print(f"  所有出发字段: {list(departure.keys())}")
                
                print("\n到达信息:")
                print(f"  延误: {arrival.get('delay')}")
                print(f"  计划: {arrival.get('scheduled')}")
                print(f"  预计: {arrival.get('estimated')}")
                print(f"  实际: {arrival.get('actual')}")
                print(f"  所有到达字段: {list(arrival.keys())}")
                
                # 检查是否有其他可能包含延误信息的字段
                print("\n--- 其他可能包含延误信息的字段 ---")
                for key, value in flight.items():
                    if 'delay' in key.lower():
                        print(f"  {key}: {value}")
                
            else:
                print("未找到航班数据")
                print(f"完整响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"API请求失败: {response.status_code}")
            print(f"响应: {response.text}")
            
    except Exception as e:
        print(f"错误: {e}")

def compare_flights(flight_list):
    """
    比较多个航班的延误数据格式
    """
    print("=== 航班延误数据格式比较 ===\n")
    
    for flight_iata in flight_list:
        print(f"\n分析航班 {flight_iata}:")
        debug_flight_data(flight_iata)
        print("\n" + "="*50)

if __name__ == "__main__":
    # 在这里输入你想要分析的航班号
    flights_to_analyze = [
        "ZE984"
        # 添加更多你想要分析的航班号
    ]
    
    compare_flights(flights_to_analyze)