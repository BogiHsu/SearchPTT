# SearchPTT Server
f07942095 許博竣

## Usage
1. Install the required packages 
```bash
pip install -r requirements.txt
```

2. Modified the host information in `src/config.py`
- `server_ip`: the IP address of the host
- `server_port`: the port of the host
- `ptt_id`: username used to login to and search on PTT
- `ptt_pw`: password used to login to and search on PTT
- `ipinfo_token`: the token to access [ipinfo.io](https://ipinfo.io/)

3. Run the server
```bash
cd src
python main.py
```
