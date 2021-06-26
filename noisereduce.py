import speech_recognition as spr
from googletrans import Translator
from gtts import gTTS
import os
import os.path as path
import getopt
import sys
input_file, from_lang, to_lang, accent, output = '', '', '', '', 'captured_voice.mp3'
params = getopt.getopt(sys.argv[1:], 'i:s:r:o:', [
                       'Input=', 'Source_lang=', 'Resultant_lang=', 'accent=', 'output='])[0]

for currentArgument, currentValue in params:
    if currentArgument in ('-i', '--Input'):
        input_file = currentValue
    elif currentArgument in ('-s', '--Source_lang'):
        from_lang = currentValue
    elif currentArgument in ('-r', '--Resultant_lang'):
        to_lang = currentValue
    elif currentArgument in ('--accent'):
        accent = currentValue
    elif currentArgument in ('-o', '--output'):
        output = currentValue
# print(output, from_lang, to_lang, accent)
if(accent == ''):
    accent = from_lang
AUDIO_FILE = input_file
# Creating Recogniser() class object
recog1 = spr.Recognizer()

# Creating microphone instance
# mc = spr.Microphone()

# Capture Voice
# Here initialising the recorder with
# hello, whatever after that hello it
# will recognise it.

# Translator method for translation
translator = Translator()

# short form of english in which
# you will speak


# In which we want to convert, short
# form of hindi
with spr.AudioFile(AUDIO_FILE) as source:
    # print(source.get_pyaudio())
    # print("Speak a stentence...")
    # recog1.adjust_for_ambient_noise(source, duration=0.2)
    audio = recog1.record(source)
    # Storing the speech into audio variable
    # audio = recog1.listen(source)
    # with open("microphone-results.wav", "wb") as f:
    #     f.write(audio.get_wav_data())
    # os.system("start microphone-results.wav")
    # Using recognize.google() method to
    # convert audio into text
    get_sentence = recog1.recognize_google(audio)

    # Using try and except block to improve
    # its efficiency.
    try:
        # Printing Speech which need to
        # be translated.
        print('{'+'"original_text": "'+get_sentence+'",')

        # Using translate() method which requires
        # three arguments, 1st the sentence which
        # needs to be translated 2nd source language
        # and 3rd to which we need to translate in
        text_to_translate = translator.translate(
            get_sentence, src=from_lang, dest=to_lang)

        # Storing the translated text in text
        # variable

        text = text_to_translate.text

        # Using Google-Text-to-Speech ie, gTTS() method
        # to speak the translated text into the
        # destination language which is stored in to_lang.
        # Also, we have given 3rd argument as False because
        # by default it speaks very slowly
        speak = gTTS(text=text, lang=accent, slow=False)

        # Using save() method to save the translated
        # speech in capture_voice.mp3
        speak.save(output)
        print('"translated_text":"'+text+'",')
        print('"Success":'+'"true"}')
        # print(text)
        sys.stdout.flush()
        # Using OS module to run the translated voice.
        # os.system("start "+output)

    # Here we are using except block for UnknownValue
    # and Request Error and printing the same to
    # provide better service to the user.
    except spr.UnknownValueError:
        print("Unable to Understand the Input")

    except spr.RequestError as e:
        print("Unable to provide Required Output".format(e))
