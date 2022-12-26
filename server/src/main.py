import os
import time
import flask
import threading
from flask import request
from flask import jsonify
from flask_cors import CORS
from flask import Response, send_file
from ptt import login, get_hot_boards
from config import server_ip, server_port
from ptt import search_posts, analyze_posts, post_to_podcast


app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['JSON_AS_ASCII'] = False
CORS(app)
search_list = None
search_result = None
analyze_list = None
analyze_result = None
podcast_list = None
podcast_result = None


# ip:port
@app.route('/', methods=['GET'])
def home():
    return 'True'


# ip:port/hot_board?n_boards=10
@app.route('/hot_board', methods=['GET'])
def hot_board():
    n_boards = request.args.get('n_boards')
    try:
        n_boards = int(n_boards)
    except:
        n_boards = 10

    return jsonify(get_hot_boards(n_boards))


# ip:port/search?b=board&k=keyword&a=author&p=push&m=10
@app.route('/search', methods=['GET'])
def search():
    global search_list, search_result
    search_list = None
    search_result = None
    board = request.args.get('b')
    if board is None:
        return []
    keyword = request.args.get('k')
    author = request.args.get('a')
    push = request.args.get('p')
    max_n_posts = request.args.get('m')
    try:
        max_n_posts = int(max_n_posts)
    except:
        max_n_posts = 10

    search_list = {
        'board': board, 'keyword': keyword, 'author': author,
        'push': push, 'max_n_posts': max_n_posts
    }

    t = 1
    while search_result is None:
        time.sleep(t)
        t = min(t+1, 10)
    ret = jsonify(search_result)
    search_list = None
    search_result = None

    return ret


# ip:port/analyze?b=board&k=keyword&a=author&p=push&m=50
@app.route('/analyze', methods=['GET'])
def analyze():
    global analyze_list, analyze_result
    analyze_list = None
    analyze_result = None
    board = request.args.get('b')
    if board is None:
        return []
    keyword = request.args.get('k')
    author = request.args.get('a')
    push = request.args.get('p')
    max_n_posts = request.args.get('m')
    try:
        max_n_posts = int(max_n_posts)
    except:
        max_n_posts = 50

    analyze_list = {
        'board': board, 'keyword': keyword, 'author': author,
        'push': push, 'max_n_posts': max_n_posts
    }

    t = 1
    while analyze_result is None:
        time.sleep(t)
        t = min(t+1, 10)
    ret = jsonify(analyze_result)
    analyze_list = None
    analyze_result = None

    return ret


# ip:port/podcast?b=board&a=aid
@app.route('/podcast', methods=['GET'])
def podcast():
    global podcast_list, podcast_result
    podcast_list = None
    podcast_result = None
    board = request.args.get('b')
    aid = request.args.get('a')
    if board is None or aid is None:
        return []

    podcast_list = {'board': board, 'aid': aid}

    t = 1
    while podcast_result is None:
        time.sleep(t)
        t = min(t+1, 10)
    ret = jsonify(podcast_result)
    podcast_list = None
    podcast_result = None

    return ret


# ip:port/image?i=img
@app.route('/image', methods=['GET'])
def image():
    img = request.args.get('i')
    if os.path.exists(img):
        return send_file(img, mimetype='image/png')
    else:
        return {}


# ip:port/audio?a=audio
@app.route('/audio', methods=['GET'])
def audio():
    audio = request.args.get('a')
    if os.path.exists(audio):
        def generate():
            with open(audio, 'rb') as fmpeg:
                data = fmpeg.read(1024)
                while data:
                    yield data
                    data = fmpeg.read(1024)

        return Response(generate(), mimetype='audio/mpeg')
    else:
        return {}


if __name__ == '__main__':
    try:
        ptt_bot = login()
        threading.Thread(
            target=lambda: app.run(
                host=server_ip, port=server_port, use_reloader=False)
        ).start()
    except Exception as e:
        print(e)

    try:
        while True:
            try:
                # search
                if search_list is not None:
                    try:
                        search_result = search_posts(
                            ptt_bot=ptt_bot, **search_list)
                    except Exception as e:
                        print(e)
                        search_result = []
                    search_list = None

                # analyze
                if analyze_list is not None:
                    try:
                        analyze_result = analyze_posts(
                            ptt_bot=ptt_bot, **analyze_list)
                    except Exception as e:
                        print(e)
                        analyze_result = []
                    analyze_list = None

                # pocast
                if podcast_list is not None:
                    try:
                        podcast_result = post_to_podcast(
                            ptt_bot=ptt_bot, **podcast_list)
                    except Exception as e:
                        print(e)
                        podcast_result = []
                    podcast_list = None

            except KeyboardInterrupt:
                ptt_bot.logout()
                break
    except Exception as e:
        print(e)
        ptt_bot.logout()
