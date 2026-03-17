import { Routes } from '@angular/router';

import { HomeComponent } from './pages/public/home/home.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { DashboardComponent } from './pages/private/dashboard/dashboard.component';
import { InfoComponent } from './pages/public/info/info.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'features', component: InfoComponent, data: { title: 'Fonctionnalités', description: 'Découvrez toutes les fonctionnalités de Finova.' } },
  { path: 'security', component: InfoComponent, data: { title: 'Sécurité', description: 'Tout sur la sécurité et la protection de vos données.' } },
  { path: 'pricing', component: InfoComponent, data: { title: 'Tarifs', description: 'Consultez nos offres et plans tarifaires.' } },
  { path: 'about', component: InfoComponent, data: { title: 'À propos', description: 'Notre mission et notre équipe.' } },
  { path: 'cards', component: InfoComponent, data: { title: 'Cartes', description: 'Gérez vos cartes et options de paiement.' } },
  { path: 'business', component: InfoComponent, data: { title: 'Comptes Business', description: 'Solutions dédiées aux entreprises.' } },
  { path: 'blog', component: InfoComponent, data: { title: 'Blog', description: 'Actualités et conseils Finova.' } },
  { path: 'careers', component: InfoComponent, data: { title: 'Carrières', description: 'Rejoignez notre équipe.' } },
  { path: 'press', component: InfoComponent, data: { title: 'Presse', description: 'Ressources presse et communiqués.' } },
  { path: 'privacy', component: InfoComponent, data: { title: 'Confidentialité', description: 'Notre politique de confidentialité.' } },
  { path: 'terms', component: InfoComponent, data: { title: 'Conditions', description: 'Conditions générales d\'utilisation.' } },
  { path: 'cookies', component: InfoComponent, data: { title: 'Cookies', description: 'Informations sur l\'utilisation des cookies.' } },
  { path: 'license', component: InfoComponent, data: { title: 'Licence', description: 'Informations sur la licence et l\'utilisation.' } },
  { path: 'help', component: InfoComponent, data: { title: 'Centre d\'aide', description: 'Besoin d\'aide ? Nous sommes là.' } },
  { path: 'contact', component: InfoComponent, data: { title: 'Contact', description: 'Contactez l\'équipe Finova.' } }
];
