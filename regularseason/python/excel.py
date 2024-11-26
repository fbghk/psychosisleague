import re
import pandas as pd
import json

# JSON 파일 읽기
with open('data.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# 첫 번째 객체의 "content" 값 추출
data = json_data[0]['content']

# content 값을 JSON 형태로 저장
output_data = {"content": data}

# 공백 및 불필요한 부분 제거하고 리스트로 변환
cleaned_data = re.sub(r'[\t\n]+', ' ', output_data)

print(cleaned_data)