import snownlp
import requests
from opencc import OpenCC
from itertools import chain
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from config import ipinfo_token


def snow_analysis(content, push):
    t2s = OpenCC('t2s')
    s2t = OpenCC('s2t')

    # process content
    content = '。'.join(content)
    s = snownlp.SnowNLP(t2s.convert(content))
    sm = [s2t.convert(x) for x in s.summary(2)]
    kw = [s2t.convert(w) for w in s.keywords(50) if (len(w) > 1 and len(w) < 5)]
    po_sent = s.sentiments

    # process push
    pu_sent = 0
    push = [p for p in push if len(p) > 0]
    if len(push) > 0:
        pu_sent = []
        for single_push in push:
            s = snownlp.SnowNLP(t2s.convert(single_push))
            pu_sent.append(s.sentiments)
        pu_sent = sum(pu_sent) / len(pu_sent)

    return sm, kw, po_sent, pu_sent


def hot_keyword_and_cloud(content, kw_list):
    t2s = OpenCC('t2s')
    s2t = OpenCC('s2t')

    content = list(chain.from_iterable(content))
    content = '。'.join(content)
    s = snownlp.SnowNLP(t2s.convert(content))
    kw = [s2t.convert(w) for w in s.keywords(50) if (len(w) > 1 and len(w) < 5)]
    if len(kw) > 6:
        kw = kw[:6]

    kw_list = list(chain.from_iterable(kw_list))
    wordcloud = WordCloud(font_path='./NotoSansTC.otf', width=400, height=300).generate(' '.join(kw_list))
    plt.figure(figsize=(4, 3))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.tight_layout(pad=0)
    plt.savefig('keyword.png', transparent=True)

    return kw, 'keyword.png'


def city_chart(ip_list):
    city_list = []
    for ip in ip_list:
        city = analyze_ip(ip)['city']
        if city != 'city':
            city = city.replace('city', '').strip()
        if city != 'City':
            city = city.replace('City', '').strip()
        if city == 'None' and city in city_list:
            continue
        city_list.append(city)

    wordcloud = WordCloud(font_path='./NotoSansTC.otf', width=400, height=300).generate(' '.join(city_list))
    plt.figure(figsize=(4, 3))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.tight_layout(pad=0)
    plt.savefig('city.png', transparent=True)

    return 'city.png'


def analyze_ip(ip):
    try:
        url = 'http://ipinfo.io/'+ip+'?token='+ipinfo_token
        ip_data = requests.get(url).json()
    except:
        return {'org': 'None', 'city': 'None'}

    return ip_data
