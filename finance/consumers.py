import asyncio
import json
from websocket import WebSocketApp, enableTrace
from channels.consumer import AsyncConsumer
from random import randint
from time import sleep

class PracticeConsumer(AsyncConsumer):

    async def websocket_connect(self,event):
        # when websocket connects

        await self.send({"type": "websocket.accept",
                         })

        await self.send({"type":"websocket.send",
                         "text":0})

    async def websocket_receive(self,event):
        # when messages is received from websocket
        sleep(1)

        await self.send({"type": "websocket.send",
                         "text":str(randint(0,100))})

    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)

def message_func(ws, message):
    print(message)
def error_func(ws, error):
    print(error)
def close_func(ws, close_status_code, close_msg):
    print("### closed ###")
def get_data(ws):
    # ws.send('{"type":"subscribe","symbol":"AAPL"}')
    # ws.send('{"type":"subscribe","symbol":"AMZN"}')
    ws.send('{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}')
    # ws.send('{"type":"subscribe","symbol":"IC MARKETS:1"}')

class Stocket(WebSocketApp):
    def __init__(self, url, header=None, on_open=None, on_message=None, on_error=None, on_close=None, on_ping=None, on_pong=None, on_cont_message=None, keep_running=True, get_mask_key=None, cookie=None, subprotocols=None, on_data=None):
        super().__init__(url, header=header, on_open=on_open, on_message=on_message, on_error=on_error, on_close=on_close, on_ping=on_ping, on_pong=on_pong, on_cont_message=on_cont_message, keep_running=keep_running, get_mask_key=get_mask_key, cookie=cookie, subprotocols=subprotocols, on_data=on_data)

        enableTrace(True)
        self.on_message = message_func
        self.on_error = error_func
        self.on_close = close_func
        self.on_open = get_data

if __name__ == "__main__":
    token = 'c5qa9fiad3iaqkuej3vg'
    stk = Stocket(url = f'wss://ws.finnhub.io?token={token}')
    stk.run_forever()