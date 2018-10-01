# coding=utf-8
import csv

path = 'data/loc/laposte_hexasmal.csv'
out = open('data_json/location.json', 'w')
out.write('{')

reader = csv.reader(open(path, newline=''), delimiter=';')
added = []
for row in reader:
    if row[0] not in added:
        added.append(row[0])
        pos = row[5].split(',')
        if len(pos) == 2:
            lat = pos[0].strip()
            lon = pos[1].strip()
            out.write('"' + str(row[0]) + '":{"lat":' + lat + ',"lon":' + lon + '},')

out.write('"-1":{}}')
out.close()