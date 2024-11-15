import { Card, CardContent } from "@/components/ui/card"
import { FileText, Edit, Users, BarChart } from 'lucide-react'

type SummaryPaneProps = {
  jobDescription: string;
  criteriaCount: number;
  resumeCount: number;
  rankingsCount: number;
  currentStep: number;
}

export function SummaryPane({
  jobDescription,
  criteriaCount,
  resumeCount,
  rankingsCount,
  currentStep
}: SummaryPaneProps) {
  const stepExplanations = [
    {
      title: "Generate Scoring System",
      description: "First, we analyze the job description to generate a sample scoring system. You can also specify any additional criteria you want to consider when reviewing resumes.",
      icon: <FileText className="w-6 h-6 mr-3" />,
      status: `Job Description: ${jobDescription ? 'Provided' : 'Not provided'}`
    },
    {
      title: "Review Scoring System",
      description: "Take a look at the generated scoring system and make any necessary edits. You can adjust criteria, their descriptions, and weights to best fit your needs.",
      icon: <Edit className="w-6 h-6 mr-3" />,
      status: `Criteria: ${criteriaCount}`
    },
    {
      title: "Upload Resumes",
      description: "Upload the resumes you want to evaluate. The beta version of this application allows up to 20 resumes to be reviewed at once.",
      icon: <Users className="w-6 h-6 mr-3" />,
      status: `Resumes: ${resumeCount}`
    },
    {
      title: "View Rankings",
      description: "We compare candidates against each other based on the scoring system you've defined. You'll see a ranked list of candidates with their scores and reasoning.",
      icon: <BarChart className="w-6 h-6 mr-3" />,
      status: `Rankings: ${rankingsCount}`
    }
  ];

  const currentStepInfo = stepExplanations[currentStep - 1];

  return (
    <div className="w-80">
      <Card className="bg-slate-800 text-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg">
              {currentStepInfo.icon}
              <span>{currentStepInfo.title}</span>
            </div>
            <p className="text-sm text-gray-300">{currentStepInfo.description}</p>
            <div className="bg-green-500 text-white px-2 py-1 rounded text-sm inline-block">
              {currentStepInfo.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}