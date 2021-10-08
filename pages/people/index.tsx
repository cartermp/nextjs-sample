import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import axios from 'axios'
import { Person }  from '../api/data'

export const getStaticProps = async () => {
  const res = await axios.get<Person[]>(`${process.env.API_ENDPOINT}/people`)
  const people = res.data
  return {
    props: {
      people,
    }
  }
}

const PeoplePage = ({ people }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>People</title>
        <meta name="description" content="People people people" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the people page!
        </h1>

        <p className={styles.description}>
          Get started by clicking on a person.
        </p>

        <div className={styles.grid}>
          {people.map((p) => (
            <a key={p.id} href={`./people/${p.id}`} className={styles.card}>
              <h2>{p.name} &rarr;</h2>
              <p>Click this stuff to get more info on {p.name}!</p>
            </a>
          ))}
        </div>
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

export default PeoplePage