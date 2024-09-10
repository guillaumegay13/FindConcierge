import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { DEFAULT_LANGUAGE } from './config';

export default function Home() {
  const headersList = headers();
  const host = headersList.get('host') || '';

  if (host.endsWith('.fr')) {
    redirect('/fr');
  } else if (host.endsWith('.app') || host.endsWith('.com')) {
    redirect('/en');
  } else {
    redirect(`/${DEFAULT_LANGUAGE}`);
  }
}