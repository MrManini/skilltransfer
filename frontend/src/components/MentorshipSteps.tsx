import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import type { MentorshipStep } from '@/types'
import { toast } from 'sonner'

interface MentorshipStepsProps {
  serviceId: string
  bookingId: string
  onComplete: () => void
}

export default function MentorshipSteps({ serviceId, bookingId, onComplete }: MentorshipStepsProps) {
  const [step, setStep] = useState<MentorshipStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  const fetchNextStep = async () => {
    setLoading(true)
    try {
      const nextStep = await api.getNextStep(serviceId, bookingId)
      setStep(nextStep)
    } catch {
      toast.error('Failed to load step')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNextStep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, bookingId])

  const handleCompleteStep = async () => {
    if (!step) return
    setCompleting(true)
    try {
      const result = await api.completeStep(serviceId, bookingId)
      if (result.stepNumber >= result.totalSteps && result.isCompleted) {
        toast.success('All steps completed! Well done!')
        onComplete()
      } else {
        toast.success(`Step ${step.stepNumber} completed!`)
        fetchNextStep()
      }
    } catch {
      toast.error('Failed to complete step')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!step) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        No steps available
      </div>
    )
  }

  const progressPercent = ((step.stepNumber - 1) / step.totalSteps) * 100

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Step {step.stepNumber} of {step.totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progressPercent)}% complete
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">{step.title}</h4>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
      <Button
        onClick={handleCompleteStep}
        disabled={completing}
        className="w-full"
      >
        {completing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : step.stepNumber === step.totalSteps ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Complete & Finish
          </>
        ) : (
          <>
            Complete Step
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
