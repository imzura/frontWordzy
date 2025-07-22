import CourseProgrammingForm from "./course-programming-form"
import UserMenu from "../../../../shared/components/userMenu"

export default function CourseProgramming() {

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Programación de Cursos</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        <CourseProgrammingForm />
      </div>
    </div>
  )
}
