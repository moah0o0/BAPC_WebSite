from flask import Flask, send_from_directory, make_response, request
import os
from pocketbase import PocketBase
import re
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드
load_dotenv()

# 중앙 설정 - .env에서 읽어옴
API_URL = os.getenv("VUE_APP_API_URL", "https://api.bapc.kr")
CDN_URL = os.getenv("VUE_APP_CDN_URL", "https://cdn.bapc.kr")
SITE_URL = os.getenv("VUE_APP_SITE_URL", "https://bapc.kr")
FLASK_PORT = int(os.getenv("FLASK_PORT", 8240))

app = Flask(__name__, static_folder='dist', static_url_path="/")
client = PocketBase(API_URL)

def to_cdn_url(raw_url):
    """API 파일 URL을 CDN URL로 변환"""
    if not raw_url:
        return raw_url
    return re.sub(r'^https?://[^/]+/api/files', CDN_URL, raw_url)


@app.errorhandler(404)
def not_found(e):
    requested_path = request.path
    titles = {"/index":"부산반빈곤센터", "/about":"단체 소개", "/board":"게시판", "/newsletter":"쇠비름", "/event":"단체 일정"}
    descriptions = {
        "/index":"빈곤에 처한 주민 스스로가 권리를 찾을 수 있도록 상담, 교육 등을 하는 비영리단체(NPO)입니다. IMF 이후 심화된 실업과 빈곤에 대응하던 시민사회의 흐름에 이어서 2010년 4월 1일 창립했습니다. 반(反)빈곤운동은 기존의 구호나 시혜적인 관점을 넘어서 주민 스스로 조직하고 힘을 키우는 것을 목표로 합니다. 누구나 기본적인 생활을 할 수 있어야 한다는 의미의 ‘기본생활권’을 추구하는 다양한 활동들을 하고 있습니다.",
        "/about":"빈곤에 처한 주민 스스로가 권리를 찾을 수 있도록 상담, 교육 등을 하는 비영리단체(NPO)입니다. IMF 이후 심화된 실업과 빈곤에 대응하던 시민사회의 흐름에 이어서 2010년 4월 1일 창립했습니다. 반(反)빈곤운동은 기존의 구호나 시혜적인 관점을 넘어서 주민 스스로 조직하고 힘을 키우는 것을 목표로 합니다. 누구나 기본적인 생활을 할 수 있어야 한다는 의미의 ‘기본생활권’을 추구하는 다양한 활동들을 하고 있습니다.", 
        "/board":"부산반빈곤센터의 활동소식, 자료, 공지사항 등을 확인해보세요.", 
        "/newsletter":"쇠비름은 부산반빈곤센터가 격월 발행하는 소식지입니다. 다양한 회원들의 이야기와 활동소식이 담겨있으니 읽어보세요!", 
        "/event":"부산반빈곤센터는 매월 일정을 공개하고 있습니다. 매월 센터의 주요 일정을 공개하고 있는데요. 이번 달, 센터는 무엇을 하는지 궁금하다면 확인해보세요!"
    }
    
    pageName = None
    for i in titles:
        if requested_path.startswith(i):
            pageName = i
            break

    if requested_path == "/":
        pageName = "/index"

    if pageName is None:
        return send_from_directory(app.static_folder, 'index.html')


    title = titles[pageName]
    description = descriptions[pageName]
    og_image = f"{SITE_URL}/default_thumbnail{pageName.replace('/','')}.png"
    url = SITE_URL + requested_path

    index_path = os.path.join(app.static_folder, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
    

    meta_tags = f"""
    <title>부산반빈곤센터</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="{description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="{url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{og_image}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:site_name" content="부산반빈곤센터" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{og_image}" />
    """
    html = html.replace('<head>', f'<head>\n{meta_tags}\n')

    response = make_response(html)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

@app.route("/default_thumbnail<record_id>.png")
def none_thumbnail(record_id):
    return send_from_directory(app.static_folder, 'default_thumbnail.png')

@app.route("/post/<collection_name>/<record_id>")
def post(collection_name, record_id):
    index_path = os.path.join(app.static_folder, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    record = client.collection(collection_name).get_one(record_id)
    title = record.title + " | 부산반빈곤센터"
    description = parse_editor_content_text_only(record.content_blocks)
    description = re.sub(r'<[^>]+>', '', description)
    description = re.sub(r'&[^;\s]+;', ' ', description)
    description = description.replace('"', "")[:500]
    og_image = f"{SITE_URL}/default_thumbnail{record_id}.png"
    url = f"{SITE_URL}/post/{collection_name}/{record_id}"
    if record.thumbnail != "":
        og_image = to_cdn_url(client.get_file_url(record, record.thumbnail))


    meta_tags = f"""
    <title>{title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="{description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="{url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{og_image}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:site_name" content="부산반빈곤센터" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{og_image}" />
    """

    html = html.replace('<head>', f'<head>\n{meta_tags}\n')

    response = make_response(html)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'

    return response

import re

def parse_editor_content_text_only(data):
    if not data or 'blocks' not in data or not isinstance(data['blocks'], list):
        return ''

    texts = []

    for block in data['blocks']:
        block_type = block.get('type')
        block_data = block.get('data', {})

        if block_type == 'header':
            text = block_data.get('text', '')
            texts.append(text)

        elif block_type == 'paragraph':
            text = block_data.get('text', '')
            texts.append(text)

        elif block_type == 'checkList':
            items = block_data.get('items', [])
            for item in items:
                text = item.get('text', '')
                texts.append(text)

        elif block_type == 'image':
            caption = block_data.get('caption', '')
            if caption:
                texts.append(caption)

        elif block_type == 'attaches':
            title = block_data.get('title', '')
            if title:
                texts.append(title)

        elif block_type == 'youtubeEmbed':
            url = block_data.get('url', '')
            # 유튜브 링크 자체를 텍스트로 넣거나 무시 가능
            texts.append(url)

        else:
            # 기타 타입 무시
            pass

    # 모든 텍스트를 한 줄로 합치거나 줄바꿈 넣을 수도 있음
    return ' '.join(texts).replace("\n", "")


if __name__ == "__main__":
    app.run(port=FLASK_PORT, debug=True)
