const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200'
});

async function createBookIndex() {
  try {
    const indexExists = await client.indices.exists({ index: 'books' });

    if (!indexExists.body) {
      const response = await client.indices.create({
        index: 'books',
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              author: { type: 'keyword' },
              category: { type: 'keyword' },
              published_date: { type: 'date' },
            },
          },
        },
      });
      console.log('Index created:', response);
    } else {
      console.log('Index already exists');
    }
  } catch (err) {
    console.error('Error initializing Elasticsearch index:', err.meta?.body?.error || err);
  }
}

async function indexBooks(body) {
  await client.index({
    index: 'books',
    id: body._id.toString(),
    body: {
      title: body.title,
      author: body.author,
      category: body.category ,
      published_date: body.published_date,
    },
  });
  await client.indices.refresh({ index: 'books' });
}

async function deleteBookFromIndex(bookId) {
  try {
    await client.delete({
      index: 'books',
      id: bookId.toString(),
    });
    await client.indices.refresh({ index: 'books' });
  } catch (err) {
    if (err.meta && err.meta.statusCode !== 404) {
      throw err;
    }
  }
}

async function initializeElasticsearch() {
  await createBookIndex();
}

module.exports = {
createBookIndex,
indexBooks,
deleteBookFromIndex,
initializeElasticsearch
};
