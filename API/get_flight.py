# find_flights.py
import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

def find_available_flights():
    api_key = os.getenv('AVIATIONSTACK_API_KEY')
    base_url = "http://api.aviationstack.com/v1/flights"
    
    # 查询当前活跃的航班
    params = {
        'access_key': api_key,
        'limit': 10,  # 限制返回数量
        'flight_status': 'active'  # 只查询活跃航班
    }
    
    try:
        response = requests.get(base_url, params=params)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('data'):
                print("=== 找到的航班 ===")
                for i, flight in enumerate(data['data']):
                    airline = flight.get('airline', {}).get('name', '未知')
                    flight_iata = flight.get('flight', {}).get('iata', '未知')
                    flight_number = flight.get('flight', {}).get('number', '未知')
                    departure = flight.get('departure', {}).get('iata', '未知')
                    arrival = flight.get('arrival', {}).get('iata', '未知')
                    status = flight.get('flight_status', '未知')
                    
                    print(f"{i+1}.{airline} / {flight_iata}: {departure} -> {arrival} ({status})")
                    
                    # 显示更多详细信息（可选）
                    print(f"   出发: {flight.get('departure', {}).get('airport', '未知')}")
                    print(f"   到达: {flight.get('arrival', {}).get('airport', '未知')}")
                    print(f"   计划出发: {flight.get('departure', {}).get('scheduled', '未知')}")
                    print(f"   实际出发: {flight.get('departure', {}).get('actual', '未知')}")
                    print(f"   延误: {flight.get('departure', {}).get('delay', '无')}分钟")
                    print()
            else:
                print("没有找到航班数据")
                print(f"完整响应: {json.dumps(data, indent=2)}")
        else:
            print(f"请求失败: {response.status_code}")
            print(f"响应: {response.text}")
            
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    find_available_flights()