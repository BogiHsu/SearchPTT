import os
from gtts import gTTS


def text2speech(title, author, content):
    tgt = [title]+[author]+content
    cmd = ''
    for i in range(len(tgt)):
        txt = tgt[i]
        tts = gTTS(text=txt, lang='zh-tw')
        tts.save(str(i)+'.mp3')
        if cmd != '':
            cmd += '|'
        cmd += str(i)+'.mp3'
    os.system('rm -f tts.mp3')
    os.system(
        'ffmpeg -i "concat:'+cmd+'" -acodec copy tts.mp3'
    )
    for i in range(len(tgt)):
        os.system('rm -f '+str(i)+'.mp3')

    return 'tts.mp3'
