// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import Footer from '@/components/Footer';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Miro Template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <ContentSection
        id="projects"
        title="Projects"
        subtitle="Our latest creations"
        images={[
          {
            src: '/assets/1.png',
            alt: 'Project 1 Description',
            title: 'Creek townhouse interior', // დავამატეთ title
            subtitle: 'Dubai' // დავამატეთ subtitle
          },
          {
            src: '/assets/2.png',
            alt: 'Project 2 Description',
            title: 'Floating Villa ',
            subtitle: 'Dubai'
          },
          {
            src: '/assets/3.png',
            alt: 'Project 3 Description',
            title: 'Project 3 Title',
            subtitle: 'Project 3 Subtitle'
          },
          {
            src: '/assets/4.png',
            alt: 'Project 4 Description',
            title: 'Project 4 Title',
            subtitle: 'Project 4 Subtitle'
          },
          {
            src: '/assets/5.png',
            alt: 'Project 5 Description',
            title: 'Project 5 Title',
            subtitle: 'Project 5 Subtitle'
          },
          {
            src: '/assets/6.png',
            alt: 'Project 6 Description',
            title: 'Project 6 Title',
            subtitle: 'Project 6 Subtitle'
          }
        ]}
      />

    </>
  );
};

export default Home;