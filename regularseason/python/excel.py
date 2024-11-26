import json

# JSON 파일 읽기
with open('data.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# 첫 번째 객체의 "content" 값 추출
data = json_data[0]['content']

# content 값 출력
print("Content 값 확인:")
print(data)

# content 값을 JSON 형태로 저장
output_data = {"content": data}
with open('content_output.json', 'w', encoding='utf-8') as output_file:
    json.dump(output_data, output_file, ensure_ascii=False, indent=4)

print("Content 값이 'content_output.json' 파일로 저장되었습니다.")
