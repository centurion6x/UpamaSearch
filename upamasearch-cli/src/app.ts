import { Command } from 'commander'
import { Client } from '@elastic/elasticsearch'
import figlet from 'figlet'
import fs from 'fs'

const client = new Client({ node: 'http://localhost:9200' })

console.log(figlet.textSync('Upama Search CLI'))

const program = new Command()
program
  .version('0.0.1')
  .option('-n, --poetName <name>', 'Search for poets name')
  .option('-t, --title <title>', 'Search for title')
  .option('-p, --poem <poem>', 'Search for poem')
  .option('-s, --source <source>', 'Search for a metaphor to source')

const options = program.opts()

program
  .command('searchPoet')
  .description('Search for a poet')
  .action(async () => {
    console.log('searching for poet')
    // console.log(`poet nam: ${options.poetName}`)
    await searchPoet(options.poetName, client)
  })


program.command('searchTitle')
.description('Search for a poem title')
.action(async () => {
  console.log('searching for title')
  // console.log(options.title)
  await searchTitle(options.title, client)
})

program.command('searchPoem')
.description('Search for a poem')
.action(async () => {
  console.log('searching for poem')
  //console.log(options.poem)
  await searchPoem(options.poem, client)
})

program.command('test')
.description('Test connectivity to elasticsearch')
.action(async () => {
  console.log('testing')
  const count = await client.count({ index: 'upamasearch' })
  console.log(count.count)
})

program.command('getMetaphors')
.description('Get metaphors matched with the input source string')
.action(async () => {
  console.log('getting metaphors')
  await getMetaphors(options.source, client)
})

program.parse(process.argv)

async function searchPoet(name: string, client: Client) {
  const results = await client.search({
    index: 'upamasearch',
    body: {
      query: {
        match: {
          Author: name,
        },
      },
    },
  })
  fs.writeFileSync('output.json', JSON.stringify(results.hits.hits, null,4))
  //console.log(results.hits.hits)
}

async function searchTitle(title: string, client: Client) {
  const results = await client.search({
    index: 'upamasearch',
    body: {
      query: {
        match: {
          "Poem Title": title,
        },
      },
    },
  })
  fs.writeFileSync('output.json', JSON.stringify(results.hits.hits, null,4))
  //console.log(results.hits.hits)
}
async function searchPoem(poem: string, client: Client) {
  const results = await client.search({
    index: 'upamasearch',
    body: {
      query: {
        match_phrase: {
          'Poem Excerpt': poem,
        }
      }
    }
  })
  fs.writeFileSync('output.json', JSON.stringify(results.hits.hits, null,4))
  //console.log(results.hits.hits)
}
async function getMetaphors(source: string, client: Client) {
  const results = await client.search({
    index: 'upamasearch',
    body: {
      query: {
        match: {
          'Metaphor Pair': source,
        },
      },
    },
  })
  fs.writeFileSync('output.json', JSON.stringify(results.hits.hits, null,4))
  //console.log(results.hits.hits)
}
