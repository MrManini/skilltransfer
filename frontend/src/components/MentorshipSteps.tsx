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
      
      // Check if there's a message indicating completion
      if (result.message) {
        toast.success(result.message)
      }
      
      // Check if all steps are completed
      if (result.message && result.message.includes("Todos los pasos")) {
        toast.success('All steps completed! Well done!')
        onComplete()
      } else {
        // Fetch the next step
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

  // Handle case where all steps are completed
  if (step.message && step.message.includes("Todos los pasos completados")) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">All Steps Completed!</span>
          <span className="text-muted-foreground">100% complete</span>
        </div>
        <Progress value={100} className="h-2" />
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">🎉 Mentorship Complete</h4>
          <p className="text-sm text-muted-foreground">You have successfully completed all mentorship steps.</p>
        </div>
        <Button onClick={onComplete} className="w-full">
          <CheckCircle2 className="h-4 w-4" />
          Mark Booking as Complete
        </Button>
      </div>
    )
  }

  // Calculate progress using the new backend structure
  const progressPercent = step.totalSteps && step.completedSteps !== undefined
    ? (step.completedSteps / step.totalSteps) * 100
    : 0

  const currentStepNumber = step.currentStepNumber || step.order || 1
  const totalSteps = step.totalSteps || 1

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Step {currentStepNumber} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progressPercent)}% complete
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">{step.title}</h4>
        {step.message && (
          <p className="text-sm text-muted-foreground">{step.message}</p>
        )}
      </div>
      <Button
        onClick={handleCompleteStep}
        disabled={completing}
        className="w-full"
      >
        {completing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : currentStepNumber === totalSteps ? (
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
