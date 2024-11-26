import re
import json

# JSON 파일 읽기
with open('data.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# 첫 번째 객체의 "content" 값 추출
data = json_data[0]['content']

# "투수" 부분만 추출하기 위한 정규식 패턴 수정
pattern = r'등번호\s+투수([\s\S]+?)(?=\s*등번호\s+(?:포수|내야수|외야수))'

# "투수" 데이터를 추출
matches = re.search(pattern, data)

# 추출된 데이터를 출력
if matches:
    pitcher_data = matches.group(1)  # group(1)을 사용하여 캡처 그룹만 가져옴
    print(pitcher_data)
else:
    print("투수 데이터가 없습니다.")