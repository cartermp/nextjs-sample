import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { Person } from '../api/data'

export const getStaticPaths = async() => {
  const res = await fetch('https://nextjs-sample-lake.vercel.app/api/people')
  const people = await res.json()
  const paths = people.map(p => ({ params: { id: p.id } }))
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await fetch(`https://nextjs-sample-lake.vercel.app/api/people/${params.id}`)
  const person: Person = await res.json()
  return {
    props: {
      person,
    }
  }
}

function PersonPage({ person }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{person.name}</title>
        <meta name={`This is ${person.name}'s page'`} content="yeet " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {person.name}
        </h1>
      </main>
    </div>
  )
}

export default PersonPage