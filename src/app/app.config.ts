import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  Cpu, Shield, BarChart2, MessageSquare, BookOpen, FileText,
  Satellite, Users, Navigation, Map, Radio, Wifi,
  Eye, Star, Clock, Brain, Lock, TrendingUp,
  Leaf, CloudRain, LayoutDashboard, MessageCircle, Database, AlertTriangle,
  Rocket, FlaskConical, Microscope, Globe, Handshake, Bell,
  Code2, Layers, Server, Zap, ChevronRight, ArrowRight, ArrowLeft, ArrowDown, ArrowUp,
  Hexagon, Sparkles, Github,
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Cpu, Shield, BarChart2, MessageSquare, BookOpen, FileText,
        Satellite, Users, Navigation, Map, Radio, Wifi,
        Eye, Star, Clock, Brain, Lock, TrendingUp,
        Leaf, CloudRain, LayoutDashboard, MessageCircle, Database, AlertTriangle,
        Rocket, FlaskConical, Microscope, Globe, Handshake, Bell,
        Code2, Layers, Server, Zap, ChevronRight, ArrowRight, ArrowLeft, ArrowDown, ArrowUp,
        Hexagon, Sparkles, Github,
      }),
    },
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
  ],
};
