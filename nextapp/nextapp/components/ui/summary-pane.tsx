import { Card, CardContent } from "@/components/ui/card"
import { FileText, Edit, Users, BarChart } from 'lucide-react'

type SummaryPaneProps = {
  jobDescription: string;
  criteriaCount: number;
  resumeCount: number;
  rankingsCount: number;
  currentStep: number;
  isStepComplete: (step: number) => boolean;
}

export function SummaryPane({
  jobDescription,
  criteriaCount,
  resumeCount,
  rankingsCount,
  currentStep,
  isStepComplete
}: SummaryPaneProps) {
  const stepExplanations = [
    {
      title: "Generate Scoring System",
      description: "We're analyzing your job description to create a tailored scoring system. This system will be the foundation for evaluating candidates. Feel free to add any specific skills or qualifications you're looking for to enhance the accuracy of our analysis.",
      icon: <FileText className="w-6 h-6 mr-3" />,
      status: `Job Description: ${jobDescription ? 'Provided' : 'Not provided'}`
    },
    {
      title: "Review Scoring System",
      description: "Now it's time to fine-tune your scoring system. You can adjust criteria, descriptions, and weights to perfectly match your ideal candidate profile. This customization ensures that our AI will evaluate resumes based on what matters most to you.",
      icon: <Edit className="w-6 h-6 mr-3" />,
      status: `Criteria: ${criteriaCount}`
    },
    {
      title: "Upload Resumes",
      description: "Let's gather the candidates! Upload up to 20 resumes for this evaluation round. Our system will analyze each resume against your customized scoring system, ensuring a fair and thorough assessment of all applicants.",
      icon: <Users className="w-6 h-6 mr-3" />,
      status: `Resumes: ${resumeCount}`
    },
    {
      title: "View Rankings",
      description: "The moment of truth! We've compared all candidates based on your unique scoring system. You'll see a ranked list of applicants, complete with individual scores and detailed reasoning for each ranking. This data will help you make informed decisions about which candidates to move forward in your hiring process.",
      icon: <BarChart className="w-6 h-6 mr-3" />,
      status: `Rankings: ${rankingsCount}`
    }
  ];

  const currentStepInfo = stepExplanations[currentStep - 1];

  const getStatusColor = (step: number) => {
    if (isStepComplete(step)) {
      return 'bg-green-500 text-white';
    } else if (step < currentStep) {
      return 'bg-yellow-500 text-black';
    } else {
      return 'bg-red-500 text-white';
    }
  };

  return (
    <div className="w-full md:w-80">
      <Card className="bg-slate-800 text-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg">
              {currentStepInfo.icon}
              <span>{currentStepInfo.title}</span>
            </div>
            <p className="text-sm text-gray-300">{currentStepInfo.description}</p>
            <div className={`px-2 py-1 rounded text-sm inline-block ${getStatusColor(currentStep)}`}>
              {currentStepInfo.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}