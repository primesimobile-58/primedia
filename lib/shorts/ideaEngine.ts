type IdeaRequest = {
  topic: string
  locale?: string
}

type IdeaOutput = {
  hook: string
  script: string
}

type MetadataOutput = {
  title: string
  description: string
  hashtags: string[]
}

export async function generateIdea(input: IdeaRequest): Promise<IdeaOutput> {
  const hook = `Şok edici gerçek: ${input.topic}`
  const script = `Bu kısa videoda ${input.topic} hakkında en merak edilen noktayı açıklıyoruz.`
  return { hook, script }
}

export async function generateMetadata(input: IdeaRequest): Promise<MetadataOutput> {
  const title = `${input.topic} hakkında bilmen gerekenler`
  const description = `${input.topic} hakkında en güncel bilgileri bu kısa videoda bul.`
  const hashtags = ["#shorts", "#trend", `#${(input.topic || "").split(" ").join("")}`]
  return { title, description, hashtags }
}

