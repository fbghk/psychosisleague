import re
import json

# JSON 파일 읽기
with open('KIA.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# 첫 번째 객체의 "content" 값 추출
data = json_data[0]['content']

# 투수 데이터 추출을 위한 첫 번째 패턴
pattern = r'등번호\s+투수\s+투타유형\s+생년월일\s+체격([\s\S]+?)(?=\s*등번호\s+(?:포수|내야수|외야수))'

# 투수 데이터 추출
matches = re.search(pattern, data)

if matches:
    pitcher_data = matches.group(1).strip()
    
    # 이름 추출을 위한 패턴 수정
    # 숫자 다음에 오는 이름만 추출하되, cm가 포함되지 않은 행만 추출
    name_pattern = r'\d+\s+([\w가-힣]+)(?=\s+(?:우|좌|양)(?:투|언))'
    
    # 모든 이름 찾기
    names = re.findall(name_pattern, pitcher_data)
    
    # 결과 출력
    for name in names:
        print(name)
else:
    print("투수 데이터가 없습니다.")