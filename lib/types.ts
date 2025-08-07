export interface Job {
  id: string;
  title: string;
  description: string;
  level: string;
  budget: string;
  isPublished: boolean;
  createdAt: Date;
  deadline: Date;
}
