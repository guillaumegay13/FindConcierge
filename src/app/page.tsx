import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from './config';

export default function Home() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
