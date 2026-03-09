import { Link } from 'react-router-dom'
import { Video, Code2, Clock, ArrowRight } from 'lucide-react'
import type { Service } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, getModeLabel, getInteractionLabel } from '@/lib/utils'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const getModeVariant = (mode: string) => {
    switch (mode) {
      case 'MENTORIA':
        return 'default'
      case 'HIBRIDO':
        return 'secondary'
      case 'EJECUTADO':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL':
        return <Video className="h-3 w-3" />
      case 'LIVE_CODING':
        return <Code2 className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{service.title}</CardTitle>
          <Badge variant={getModeVariant(service.mode)}>{getModeLabel(service.mode)}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getInteractionIcon(service.interactionType)}
          <span>{getInteractionLabel(service.interactionType)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-bold text-foreground">{formatPrice(service.price)}</span>
        <Button asChild>
          <Link to={`/book/${service.id}`}>
            Book Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
