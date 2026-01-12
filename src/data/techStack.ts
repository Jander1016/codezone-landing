export interface TechCategoryData {
  name: string;
  icon: string;
  technologies: string[];
  description?: string;
}

export const techStack: TechCategoryData[] = [
  {
    name: 'Aplicaciones Móviles',
    icon: '/icon-codezone-stacktech-app.svg',
    technologies: ['React Native', 'Ionic Framework', 'Kotlin Multiplatform']
  },
  {
    name: 'Front-End',
    icon: '/icon-codezone-stacktech-frontend.svg',
    technologies: ['HTML & CSS', 'JavaScript / TypeScript', 'Angular', 'React', 'Vue.js']
  },
  {
    name: 'Back-End',
    icon: '/icon-codezone-stacktech-backend.svg',
    technologies: ['PHP', 'Node.js', 'Java (Spring Boot)', 'Go', 'Python (Django)']
  },
  {
    name: 'Desarrollo de Software',
    icon: '/icon-codezone-stacktech-softdev.svg',
    technologies: ['C', 'Electron.js', 'Tauri', '.NET MAUI (C#)', 'Qt', 'JavaFX']
  },
  {
    name: 'Lenguajes de Scripting',
    icon: '/icon-codezone-stacktech-scripting.svg',
    technologies: ['Python', 'Bash']
  },
  {
    name: 'Bases de datos NoSQL',
    icon: '/icon-codezone-stacktech-bbdd.svg',
    technologies: ['Firebase', 'MongoDB', 'Cassandra']
  },
  {
    name: 'Bases de datos Relacionales',
    icon: '/icon-codezone-stacktech-sql.svg',
    technologies: ['PostgreSQL', 'MySQL', 'SQL Server']
  },
  {
    name: 'Desarrollo On-Cloud',
    icon: '/icon-codezone-stacktech-cloud.svg',
    technologies: ['AWS', 'Azure', 'Google Cloud Platform']
  },
  {
    name: 'Metodologías Ágiles',
    icon: '/icon-codezone-stacktech-agile.svg',
    technologies: ['Design Thinking', 'SCRUM', 'KANBAN']
  },
  {
    name: '¿Otras tecnologías?',
    icon: '/icon-codezone-stacktech-default.svg',
    technologies: [],
    description: 'Consultanos y te daremos solución'
  }
];
