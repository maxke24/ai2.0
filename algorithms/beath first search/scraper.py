from bs4 import BeautifulSoup
from requests import get
import json

fullcast = []
url = "https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm"
response = get(url)
dic = []
i = 0
html_soup = BeautifulSoup(response.text, 'html.parser')
movie_containers = html_soup.find_all('td', class_ = 'titleColumn')
for movie in movie_containers:
		movie_list = {}
		movie_url = movie.a["href"]
		movie_title = movie.a.text
		movie_list["title"] = movie_title
		url = "https://www.imdb.com{}fullcredits?ref_=tt_ql_1".format(movie_url)
		response = get(url)
		html_soup = BeautifulSoup(response.text, 'html.parser')
		cast_containers = html_soup.find('table', class_ = 'cast_list')
		cast_list = cast_containers.find_all("tr")
		for cast in cast_list:
			if cast.td.next_sibling:
				actor = cast.td.next_sibling.next_sibling.text.replace("\n ", "")
				fullcast.append(actor)
		movie_list["cast"] = fullcast
		dic.append(movie_list)
		if i >= 10:
			break;
		i += 1
data = dic
print(data)
with open("assets/json/movies.json", "w") as write_file:
    movies = json.dump(data, write_file)
