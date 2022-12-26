import getpass
import requests
from PyPtt import PTT
from tts import text2speech
from config import ptt_id, ptt_pw
from analyze import snow_analysis
from analyze import hot_keyword_and_cloud, city_chart


def login():
    max_retry = 5
    ptt_bot = None
    for retry_time in range(max_retry):
        try:
            ptt_bot = PTT.API()
            ptt_bot.login(ptt_id, ptt_pw,
                kick_other_login=False if retry_time == 0 else True)
            print('', end='')
            break
        except PTT.exceptions.LoginError:
            ptt_bot = None
            ptt_bot.log('登入失敗')
            print('', end='')
            time.sleep(3)
        except PTT.exceptions.LoginTooOften:
            ptt_bot = None
            ptt_bot.log('請稍後再試')
            print('', end='')
            time.sleep(60)
        except PTT.exceptions.WrongIDorPassword:
            ptt_bot.log('帳號密碼錯誤')
            print('', end='')
            raise
        except Exception as e:
            ptt_bot.log('其他錯誤:', e)
            print('', end='')
            break

    return ptt_bot


def get_hot_boards(n_boards=10):
    url = 'https://www.ptt.cc/bbs/hotboards.html'
    resp = requests.get(url)
    boards = [
        x.strip() for x in resp.text.split('\n') if
        x.strip().startswith('<div class=\"board-name\">') and
        x.strip().endswith('</div>')
    ]
    boards = [
        x.split('<div class=\"board-name\">')[1].split('</div>')[0] for x in boards
    ]

    n_boards = min(len(boards), n_boards)
    boards = boards[:n_boards]

    return boards


def search_posts(ptt_bot, board, keyword=None, author=None, push=None, max_n_posts=10):
    search_list = []
    if keyword is not None:
        search_list.append(
            (PTT.data_type.post_search_type.KEYWORD, keyword)
        )
    if author is not None:
        search_list.append(
            (PTT.data_type.post_search_type.AUTHOR, author)
        )
    if push is not None:
        search_list.append(
            (PTT.data_type.post_search_type.PUSH, push)
        )
    search_list = None if len(search_list) == 0 else search_list

    e_idx = ptt_bot.get_newest_index(PTT.data_type.index_type.BBS,
                                     board, search_list=search_list)
    s_idx = max(1, e_idx-max_n_posts+1)

    post_list = []
    def crawl_handler(post_info):
        parsed_post = parse_post(post_info)
        if parsed_post != {}:
            post_list.append(parsed_post)

    _, _ = ptt_bot.crawl_board(
        PTT.data_type.crawl_type.BBS,
        crawl_handler,
        board,
        start_index=s_idx,
        end_index=e_idx,
        search_list=search_list)

    return post_list[::-1]


def analyze_posts(ptt_bot, board, keyword=None, author=None, push=None, max_n_posts=10):
    post_list = search_posts(ptt_bot, board, keyword, author, push, max_n_posts)
    if post_list == []:
        return {}

    hot_keyword, keyword_png = hot_keyword_and_cloud(
        [post['content'] for post in post_list],
        [post['keyword'] for post in post_list],
    )

    return {
        'post_semantic': sum([
            post['post_semantic'] for post in post_list
        ]) / len(post_list),
        'push_semantic': sum([
            post['push_semantic'] for post in post_list
        ]) / len(post_list),
        'hot_keyword': hot_keyword,
        'keyword_png': keyword_png,
        'city_png': city_chart([
            post['ip'] for post in post_list
        ])
    }


def post_to_podcast(ptt_bot, board, aid):
    post_info = ptt_bot.get_post(board, post_aid=aid)
    parsed_post = parse_post(post_info)
    audio = text2speech(
        parsed_post['title'],
        parsed_post['author'],
        parsed_post['content']
    )

    return {
        'title': parsed_post['title'],
        'author': parsed_post['author'],
        'audio': audio
    }


def parse_post(post_info):
    if not validate_post(post_info):
        return {}

    sm, kw, po_sent, pu_sent = snow_analysis(
        clean_content(post_info.content),
        [push_info.content for push_info in post_info.push_list]
    )

    return {
        'board': post_info.board,
        'author': post_info.author.split(' (')[0],
        'date': post_info.date,
        'ip': post_info.ip,
        'region': post_info.location,
        'web_url': post_info.web_url,
        'aid': post_info.aid,
        'title': post_info.title,
        'content': clean_content(post_info.content),
        'push_list': {
            push_info.author: push_info.content for push_info in post_info.push_list
        },
        'summary': sm,
        'keyword': kw,
        'post_semantic': po_sent,
        'push_semantic': pu_sent
    }


def validate_post(post_info):
    if post_info is None:
        return False

    if post_info.delete_status != PTT.data_type.post_delete_status.NOT_DELETED:
        return False

    if post_info.is_lock:
        return False

    if not post_info.pass_format_check:
        return False

    return True


def clean_content(content):
    content = content.split('\n')
    rm = ['', '-', '--', '---', '----', '-----', '------', '\x08\x08']
    content = [l.replace('\x08', '') for l in content if l not in rm]
    content = [l for l in content if not (l.startswith('http://') or l.startswith('https://'))]
    if content[-1].startswith('Sent from '):
        content = content[:-1]
    return content
