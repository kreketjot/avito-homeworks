#!/bin/bash

sudo tcpdump -i any host 127.0.0.1 and port 3030 > tcpdump.log
