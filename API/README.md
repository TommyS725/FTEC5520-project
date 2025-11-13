## To use the API, first download the .env file which contains an API access key of AviationStack.

## Then, use cmd to run the python file app.py (python app.py) and leave this window running.

## Next, you could run get_flight.py to see 10 recent airline information (the number could be changed in the line 16 of this file)

## The detailed_flight_information.py is designed to present detailed information of a chosen airline. And you could type the iata(like ["LJ752", "ZE984", "H19975", "G59013", "3U2209"]) of your chosen airline in line 81 (more than 1 airline is permitted).

## The teat_adapter.py is designed for verifying whether the JSON data could be directly used by Chainlink. You can test the airline you want by first choose 1 and then type the iata(like ZE984). 

### If the API could not work, please check the first address in the cmd window of app.py and see whether it's the same in line 6 and 127 of test_adapter.py.
