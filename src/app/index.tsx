import { Redirect } from 'expo-router';

// Sin auth todavía: la app entra directo a Welcome tras el splash.
// TODO: cuando exista sesión, decidir aquí entre /(auth)/welcome y /(main).
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
