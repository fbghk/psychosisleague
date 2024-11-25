import re
import pandas as pd

# 크롤링한 데이터
data = """

"""

# 공백 및 불필요한 부분 제거하고 리스트로 변환
cleaned_data = re.sub(r'[\t\n]+', ' ', data)

# 키와 몸무게 패턴을 유지하면서 단어 리스트를 추출
elements = re.findall(r'\d+cm, \d+kg|[^\s]+', cleaned_data)

# 5열로 변환 (원하는 대로 설정 가능)
num_columns = 5
rows = [elements[i:i+num_columns] for i in range(0, len(elements), num_columns)]

# DataFrame 생성
df = pd.DataFrame(rows, columns=['등번호', '이름', '투타유형', '생년월일', '체격'])

# 시작과 끝 위치 탐색
start_index = df[df['이름'] == '투수'].index[0]  # 시작 위치 ("투수" 행 포함)
end_index = df[df['이름'] == '포수'].index[0]  # 끝 위치 ("포수" 행 포함)

# 시작 부분 포함, 끝 부분 제외하여 추출
filtered_df = df.iloc[start_index:end_index]

# JSON 파일로 저장하기
filtered_df.to_json('filtered_result.json', orient='records', force_ascii=False)
print("필터링된 JSON 파일로 저장되었습니다.")