import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { Person } from '../api/data'
import axios from 'axios'

export const getStaticPaths = async() => {
  const res = await axios.get<Person[]>('https://nextjs-sample-lake.vercel.app/api/people')
  const people = res.data
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

const PersonPage = ({ person }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{person.name}</title>
        <meta name={`This is ${person.id}'s page'`} content="yeet " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{person.name}</h1>

        <ul>
          <li>{`Height: ${person.height}cm`}</li>
          <li>{`Mass: ${person.mass}kg`}</li>
          <li>{`Hair color: ${person.hair_color}`}</li>
          <li>{`Skin color: ${person.skin_color}`}</li>
          <li>{`Eye color: ${person.eye_color}`}</li>
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default PersonPage