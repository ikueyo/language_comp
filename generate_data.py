import json
import os

data_dir = r"c:\Users\Username\Desktop\language competition\data"
if not os.path.exists(data_dir):
    os.makedirs(data_dir)

# Raw data extracted from analysis
# Format: [Category, Date, Time, Location, raw_lines_list]
sections = [
    {
        "category": "閩南語朗讀",
        "date": "114年12月16日（二）",
        "time": "08:40~10:10",
        "location": "視聽教室",
        "raw_data": """1 403 張語芮
2 402 謝向姸
3 401 仇佑吉
4 503 謝旻祐
5 502 潘永翔
6 502 吳苡綺
7 503 儲歆蓉
8 603 高霆皓
9 601 賴聖宸
10 603 劉昶樂"""
    },
    {
        "category": "字音字形",
        "date": "114年12月16日（二）",
        "time": "11:20~11:30",
        "location": "地下室禮堂",
        "raw_data": """1 401 韋博策
2 402 顏張森瑋
3 403 曾驛凱
4 403 黃宏晏
5 501 陳俞任
6 501 王杉豐
7 502 吳苡綺
8 502 吳譯峰
9 503 林雋宸
10 503 陳碩寪
11 601 潘永喆
12 601 劉美妤
13 602 葉軒愷
14 602 郭宸希
15 603 高群諺
16 603 吳婕希"""
    },
    {
        "category": "國語說故事",
        "date": "114年12月18日（四）",
        "time": "08:40~10:10",
        "location": "視聽教室",
        "raw_data": """1 203 郭宥寧
2 201 蘇繹帆
3 202 林妍佳
4 201 詹欣穎
5 203 胡毓竑
6 202 蔣雨彤
7 302 葉姿妤
8 303 周珉碩
9 303 林昕澄
10 301 葉駿亨
11 302 吳季筠
12 301 黃翊宸"""
    },
    {
        "category": "作文",
        "date": "114年12月18日（四）",
        "time": "10:25~11:55",
        "location": "地下室禮堂",
        "raw_data": """1 401 張懿
2 402 黃家柔
3 403 蘇翊蕎
4 501 歐蔓瑢
5 502 許亦佑
6 502 黃逸宸
7 502 田杰司
8 503 段佑恩
9 503 陳微昀
10 601 劉美妤
11 601 高裕翔
12 602 陳雨芯
13 602 劉品言
14 603 黃家馨
15 603 陳加恩"""
    },
    {
        "category": "英語朗讀",
        "date": "114年12月19日（五）",
        "time": "08:40~10:10",
        "location": "視聽教室",
        "raw_data": """1 603 簡廷安
2 601 呂蘋真
3 602 葉軒愷
4 603 劉昶樂
5 402 盧卉馨
6 401 翁巧曼
7 403 柯宥熙
8 502 許亦佑
9 503 段佑恩
10 501 施博議
11 502 詹俊星
12 503 周辰哲"""
    },
    {
        "category": "國語朗讀",
        "date": "114年12月22日（一）",
        "time": "10:25~11:55",
        "location": "視聽教室",
        "raw_data": """1 603 林廷叡
2 602 林慕恩
3 601 林霆瑋
4 602 張聖豪
5 603 簡廷安
6 601 劉子靖
7 402 顏張森瑋
8 401 王文仲
9 403 張語芮
10 503 何秉騂
11 502 洪薇喬
12 501 許格榕
13 501 陳音瑀
14 502 陳亭禎
15 503 林羿辰
16 502 董若楚"""
    }
]

participants = []

for section in sections:
    lines = section["raw_data"].split("\n")
    for line in lines:
        parts = line.strip().split()
        if len(parts) >= 3:
            # Handle potential name with spaces or odd formatting, though usually it's "No Class Name"
            # Format: Number Class Name
            number = parts[0]
            cls = parts[1]
            name = parts[-1] # Take the last part as name usually
            
            participants.append({
                "category": section["category"],
                "date": section["date"],
                "time": section["time"],
                "location": section["location"],
                "number": number,
                "class": cls,
                "name": name
            })

output_path = os.path.join(data_dir, "data.js")
with open(output_path, "w", encoding="utf-8") as f:
    json_str = json.dumps(participants, ensure_ascii=False, indent=2)
    f.write(f"const PARTICIPANTS_DATA = {json_str};")

print(f"Generated {output_path} with {len(participants)} entries.")
