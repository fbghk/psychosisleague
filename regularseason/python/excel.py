import re
import json

# JSON 파일 읽기
with open('data.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# 첫 번째 객체의 "content" 값 추출
data = json_data[0]['content']

# "투수" 데이터만 추출하기 위한 정규식 패턴
pattern = r'등번호\s+투수[\s\S]+?등번호\s+(?:포수|내야수|외야수)'

# "투수" 데이터를 추출
matches = re.search(pattern, data)

# 추출된 데이터에서 "등번호 포수" 제외
if matches:
    pitcher_data = matches.group()
    
    # "kg" 뒤에 나오는 "등번호 포수" 데이터를 제외하는 정규식
    # "kg" 이후의 "등번호"를 찾아 "등번호 포수"까지 제외
    pitcher_data = re.sub(r'kg[\s\S]+?등번호\s+(?:포수|내야수|외야수)', 'kg', pitcher_data)

    print(pitcher_data)
else:
    print("투수 데이터가 없습니다.")
