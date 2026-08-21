"use client"
import { useState, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { AnimatePresence, motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TabContent {
  badge: string
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
  imageSrc?: string
  imageAlt?: string
  visual?: ReactNode
}

interface Tab {
  value: string
  icon: ReactNode
  label: string
  content: TabContent
}

interface Feature108Props {
  badge?: string
  heading?: string
  description?: string
  tabs?: Tab[]
}

const Feature108 = ({
  badge = "shadcnblocks.com",
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Join us to build flawless web solutions.",
  tabs = [],
}: Feature108Props) => {
  const [active, setActive] = useState(tabs[0]?.value)

  if (!tabs.length) return null

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-[0.28em]">
            {badge}
          </Badge>
          <h2 className="max-w-2xl font-display text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Tabs value={active} onValueChange={setActive} defaultValue={tabs[0].value} className="mt-12">
            <TabsList className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 md:gap-10">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-foreground/40 hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-hairline bg-muted/40 p-6 lg:p-12">
              <AnimatePresence mode="wait" initial={false}>
                {tabs.map((tab) =>
                  tab.value === active ? (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      forceMount
                      asChild
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
                        className="grid place-items-center gap-12 lg:grid-cols-2 lg:gap-16"
                      >
                        <div className="flex w-full flex-col gap-5">
                          <Badge variant="outline" className="w-fit bg-background font-mono text-[10px] uppercase tracking-[0.24em]">
                            {tab.content.badge}
                          </Badge>
                          <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
                            {tab.content.title}
                          </h3>
                          <p className="text-[15px] leading-relaxed text-muted-foreground lg:text-base">
                            {tab.content.description}
                          </p>
                          {tab.content.buttonText && (
                            <Button asChild size="lg" className="mt-2 w-fit gap-2">
                              <a href={tab.content.buttonHref ?? "#"}>
                                {tab.content.buttonText}
                                <span aria-hidden>→</span>
                              </a>
                            </Button>
                          )}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.55, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                          className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-hairline bg-background"
                        >
                          {tab.content.visual ? (
                            tab.content.visual
                          ) : tab.content.imageSrc ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={tab.content.imageSrc}
                              alt={tab.content.imageAlt ?? tab.content.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <motion.div
                              initial={{ rotate: -6, scale: 0.9 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                              className="text-foreground/25 [&>svg]:h-40 [&>svg]:w-40 sm:[&>svg]:h-56 sm:[&>svg]:w-56"
                            >
                              {tab.icon}
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    </TabsContent>
                  ) : null,
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

export { Feature108 }
