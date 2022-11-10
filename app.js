const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://bumn.go.id/portfolio/cluster/')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('.section-contents').each(function(i, elem) {
                    $(elem).find('.client-logo').each(function(j, elem2) {
                        data.push({
                            name: $(elem2).find('h4').text(),
                            description: $(elem2).find('p').text(),
                            link: $(elem2).find('a').attr('href'),
                            image: $(elem2).find('img').attr('src'),
                            cluster: $(elem).find('h1').text()
                        });
                    });
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});