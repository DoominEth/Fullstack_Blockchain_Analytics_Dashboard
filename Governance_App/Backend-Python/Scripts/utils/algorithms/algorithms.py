import random
import string

def generate_data():
    randomnumber1 = random.randint(1, 100)
    randomnumber2 = random.randint(1, 100)
    randomletter1 = random.choice(string.ascii_letters)
    randomletter2 = random.choice(string.ascii_letters)
    return randomnumber1, randomnumber2, randomletter1, randomletter2
