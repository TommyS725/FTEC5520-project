import requests
import json
import time

def test_api():
    base_url = "http://127.0.0.1:8080"
    
    print("=== Chainlink航班数据适配器测试 ===\n")
    
    # 1. 测试健康检查
    print("1. 测试健康检查...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   状态码: {response.status_code}")
        print(f"   响应: {response.json()}")
        print("   ✓ 健康检查通过\n")
    except Exception as e:
        print(f"   ✗ 健康检查失败: {e}\n")
        return
    
    # 2. 获取用户输入的航班信息
    print("2. 请输入要测试的航班信息")
    print("   你可以使用从find_flights.py获取的航班号")
    print("   或者使用示例航班号: AA100, UA200, DL500, LH738等\n")
    
    # 提供一些示例航班号
    sample_flights = ["LJ752", "ZE984", "H19975", "G59013", "3U2209"]
    
    while True:
        print("可用的航班号示例:", ", ".join(sample_flights))
        flight_input = input("请输入航班IATA代码 (例如: AA100) 或输入 'quit' 退出: ").strip()
        
        if flight_input.lower() == 'quit':
            break
            
        if not flight_input:
            print("   ! 请输入有效的航班号\n")
            continue
            
        # 3. 测试航班信息端点
        print(f"\n3. 测试航班 {flight_input} 的信息...")
        test_data = {
            "id": f"test_{int(time.time())}",
            "data": {
                "flight_iata": flight_input
            }
        }
        
        try:
            response = requests.post(
                f"{base_url}/flight",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            print(f"   状态码: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("   ✓ 航班信息查询成功!")
                
                # 显示简化数据（适合智能合约使用）
                if "data" in result and "simplified" in result["data"]:
                    simplified = result["data"]["simplified"]
                    print(f"   是否延误: {simplified['is_delayed']}")
                    print(f"   出发延误: {simplified['departure_delay_minutes']} 分钟")
                    print(f"   到达延误: {simplified['arrival_delay_minutes']} 分钟")
                    print(f"   航班状态代码: {simplified['flight_status_code']}")
                    
                # 显示原始数据详情
                if "data" in result and "raw_data" in result["data"]:
                    raw_data = result["data"]["raw_data"]
                    print(f"   航空公司: {raw_data.get('airline_name', '未知')}")
                    print(f"   航班状态: {raw_data.get('flight_status', '未知')}")
                    print(f"   出发机场: {raw_data.get('departure_airport', '未知')}")
                    print(f"   到达机场: {raw_data.get('arrival_airport', '未知')}")
                    
            else:
                error_result = response.json()
                print(f"   ✗ 航班信息查询失败: {error_result.get('error', '未知错误')}")
                
        except Exception as e:
            print(f"   ✗ 请求失败: {e}")
        
        # 4. 测试延误检查端点
        print(f"\n4. 测试航班 {flight_input} 的延误检查...")
        try:
            response = requests.post(
                f"{base_url}/flight/delayed",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            print(f"   状态码: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("   ✓ 延误检查成功!")
                
                if "data" in result:
                    data = result["data"]
                    print(f"   是否延误: {data.get('isDelayed', '未知')}")
                    print(f"   出发延误: {data.get('departureDelay', '未知')} 分钟")
                    print(f"   到达延误: {data.get('arrivalDelay', '未知')} 分钟")
                    print(f"   状态代码: {data.get('statusCode', '未知')}")
                    
            else:
                error_result = response.json()
                print(f"   ✗ 延误检查失败: {error_result.get('error', '未知错误')}")
                
        except Exception as e:
            print(f"   ✗ 请求失败: {e}")
        
        print("\n" + "="*50 + "\n")
        
        # 询问是否继续测试其他航班
        continue_test = input("是否继续测试其他航班? (y/n): ").strip().lower()
        if continue_test != 'y':
            break
    
    print("\n测试完成!")

def batch_test_flights(flight_list):
    """
    批量测试航班列表
    """
    base_url = "http://127.0.0.1:8080"
    
    print("=== 批量航班测试 ===\n")
    
    for i, flight_iata in enumerate(flight_list, 1):
        print(f"{i}. 测试航班 {flight_iata}...")
        
        test_data = {
            "id": f"batch_test_{i}",
            "data": {
                "flight_iata": flight_iata
            }
        }
        
        try:
            # 测试延误检查端点
            response = requests.post(
                f"{base_url}/flight/delayed",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                data = result.get("data", {})
                print(f"   ✓ 成功 - 延误: {data.get('isDelayed', '未知')}, "
                      f"出发延误: {data.get('departureDelay', '未知')}分钟, "
                      f"到达延误: {data.get('arrivalDelay', '未知')}分钟")
            else:
                error_result = response.json()
                print(f"   ✗ 失败: {error_result.get('error', '未知错误')}")
                
        except Exception as e:
            print(f"   ✗ 请求异常: {e}")
        
        # 短暂延迟，避免请求过快
        time.sleep(1)
    
    print("\n批量测试完成!")

if __name__ == "__main__":
    print("选择测试模式:")
    print("1. 交互式测试 (手动输入航班号)")
    print("2. 批量测试 (使用预定义的航班列表)")
    
    choice = input("请输入选择 (1 或 2): ").strip()
    
    if choice == "2":
        # 在这里填入你想要批量测试的航班号
        # 你可以将从find_flights.py获取的航班号放在这里
        custom_flight_list = [
            # 在这里添加你的航班号，例如:
            # "AA100",
            # "UA200", 
            # "DL500",
            # 从find_flights.py获取的实际航班号
            "LJ752", "ZE984", "H19975", "G59013", "3U2209"
        ]
        
        if not custom_flight_list:
            print("\n请在代码中custom_flight_list列表里添加要测试的航班号")
            print("例如: custom_flight_list = ['AA100', 'UA200', 'DL500']")
        else:
            batch_test_flights(custom_flight_list)
    else:
        # 默认使用交互式测试
        test_api()