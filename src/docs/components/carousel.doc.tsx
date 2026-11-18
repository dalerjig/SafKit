import { useRef, useState } from "react";
import { Button, Card, Carousel, Flow, type CarouselRef } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getCarouselDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "carousel",
    name: "Carousel",
    importCode: 'import { Carousel, type CarouselRef } from "@ShKit";',
    description: "Пошаговый carousel для wizard/modal flow без antd Carousel. Слайды передаются как children, переключение через ref.goTo/next/prev.",    props: [
      { name: "children", type: "ReactNode", description: "Слайды carousel, каждый child — отдельный шаг." },
      { name: "activeIndex", type: "number", description: "Controlled индекс активного слайда." },
      { name: "defaultActiveIndex", type: "number", defaultValue: "0", description: "Uncontrolled стартовый слайд." },
      { name: "dots", type: "boolean", defaultValue: "true", description: "Показывать индикаторы слайдов." },
      { name: "infinite", type: "boolean", defaultValue: "false", description: "Зацикливание next/prev." },
      { name: "onChange", type: "(index) => void", description: "Событие смены слайда." },
      { name: "ref", type: "CarouselRef", description: "goTo(index, animate?), next(), prev()." }
    ],    usageCode: `const carouselRef = useRef<CarouselRef>(null);

<Carousel dots={false} ref={carouselRef}>
  <Form>...</Form>
  <Form>...</Form>
</Carousel>

<Button onClick={() => carouselRef.current?.next()}>Далее</Button>
<Button onClick={() => carouselRef.current?.prev()}>Назад</Button>
<Button onClick={() => carouselRef.current?.goTo(0)}>Сбросить</Button>`,
    preview: <CarouselPreview styles={styles} />
  };
};

const CarouselPreview = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const carouselRef = useRef<CarouselRef>(null);
  const [step, setStep] = useState(0);

  return (
    <Flow className={styles.previewNarrow} gap={12}>
      <Carousel ref={carouselRef} dots={false} onChange={setStep}>
        <Card padding="sm" title="Шаг 1. Загрузка файла">
          Выберите CSV и delimiter, затем нажмите «Далее».
        </Card>
        <Card padding="sm" title="Шаг 2. Сопоставление колонок">
          Свяжите колонки с полями и создайте view.
        </Card>
      </Carousel>
      <Flow mode="horizontal" gap={8} justify="space-between">
        <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => carouselRef.current?.prev()}>
          Назад
        </Button>
        <Button
          size="sm"
          variant="primary"
          disabled={step === 1}
          onClick={() => carouselRef.current?.next()}
        >
          Далее
        </Button>
      </Flow>
    </Flow>
  );
};
