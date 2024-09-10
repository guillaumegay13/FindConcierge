import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from './config';

export default function Home({ headers }: { headers: Headers }) {
  const host = headers.get('host') || '';
  if (host.endsWith('.fr')) {
    redirect('/fr');
  } else if (host.endsWith('.app') || host.endsWith('.com')) {
    redirect('/en');
  } else {
    redirect(`/${DEFAULT_LANGUAGE}`);
  }
}