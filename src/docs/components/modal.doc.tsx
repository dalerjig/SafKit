import { useState } from "react";
import { Button, Checkbox, DateInput, Field, Flow, Form, Input, Modal, NumberInput, Select, Textarea, useFormAction } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getModalDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "modal",
    name: "Modal",
    importCode: 'import { Button, Field, Flow, Form, Modal, useFormAction } from "@ShKit";',
    description: "Dialog overlay для форм, настроек и blocking flows без Ant Design.",    props: [
      { name: "open", type: "boolean", description: "Видимость модалки." },
      { name: "title", type: "ReactNode", description: "Опциональный заголовок dialog." },
      { name: "children", type: "ReactNode", description: "Основное содержимое." },
      { name: "headerActions", type: "ReactNode", description: "Действия справа в header перед close button." },
      { name: "footer", type: "ReactNode", description: "Нижняя зона действий." },
      { name: "size", type: '"default" | "compact"', defaultValue: '"default"', description: "compact: ширина 360px и отступы header/body/footer 12px. Сохраняет ограничение по ширине экрана." },
      { name: "width", type: "number | string", defaultValue: "520 (compact: 360)", description: "Имеет приоритет над size. Ширина dialog. number становится px, string передается как CSS width." },
      { name: "className / overlayClassName / bodyClassName", type: "string", description: "Точки настройки dialog, overlay и body для составных компонентов вроде ImagePreview." },
      { name: "onClose", type: "() => void", description: "Закрытие по overlay, Escape или close button; после закрытия фокус возвращается назад." }
    ],    usageCode: `const { errors, formAction } = useFormAction(saveObject, initialState);

<Modal
  open={open}
  title="Параметры объекта"
  width={720}
  onClose={() => setOpen(false)}
  footer={<Button type="submit" form="object-modal-form">Сохранить</Button>}
>
  <Form id="object-modal-form" action={formAction}>
    <Field label="Название" error={errors.name} required>
      <Input name="name" value={values.name} />
    </Field>
    <Field label="Площадь, м2" error={errors.area} required>
      <NumberInput name="area" value={values.area} />
    </Field>
  </Form>
</Modal>

<Modal
  open={confirmOpen}
  width={420}
  onClose={() => setConfirmOpen(false)}
  footer={<Button onClick={() => setConfirmOpen(false)}>Понятно</Button>}
>
  <Flow gap={8}>
    <strong>Сохранить черновик?</strong>
    <span>Модалка без заголовка оставляет close action справа.</span>
  </Flow>
</Modal>`,
    preview: <ModalPreview styles={styles} />
  };
}

const ModalPreview = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const [open, setOpen] = useState(false);
  const [noTitleOpen, setNoTitleOpen] = useState(false);
  const [compactOpen, setCompactOpen] = useState(false);
  const [values, setValues] = useState<ModalFormValues>({
    area: 148.37,
    comment: "Нужно проверить отметки после следующей съемки.",
    dueDate: "2026-05-18",
    email: "",
    name: "Котлован 01",
    showOnMap: true,
    status: "review"
  });
  const { errors, formAction, isPending } = useFormAction<ModalFormState>((_previousState, formData) => {
    const nextValues = getModalFormValues(formData);
    const nextErrors = validateModalForm(nextValues);

    if (Object.keys(nextErrors).length === 0) {
      setOpen(false);
      return { values: nextValues, success: true };
    }

    return {
      values: nextValues,
      errors: nextErrors,
      formError: "Проверьте обязательные поля.",
      success: false
    };
  }, initialModalFormState);

  const updateValue = <TKey extends keyof ModalFormValues>(key: TKey, value: ModalFormValues[TKey]) => {
    setValues(current => ({ ...current, [key]: value }));
  };

  return (
    <div className={styles.previewStack}>
      <Flow gap={8}>
        <Button variant="secondary" onClick={() => setOpen(true)}>Modal</Button>
        <Button variant="outline" onClick={() => setNoTitleOpen(true)}>Без заголовка</Button>
        <Button variant="outline" onClick={() => setCompactOpen(true)}>Compact — 360px</Button>
      </Flow>
      <Modal
        open={compactOpen}
        size="compact"
        title="Компактная модалка"
        onClose={() => setCompactOpen(false)}
        footer={<Button onClick={() => setCompactOpen(false)}>Готово</Button>}
      >
        <Input size="xs" label="Название" placeholder="Введите название" />
      </Modal>
      <Modal
        open={open}
        title="Параметры объекта"
        width={720}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Отмена</Button>
            <Button variant="primary" type="submit" form="object-modal-form" loading={isPending}>Сохранить</Button>
          </>
        }
      >
        <Form id="object-modal-form" action={formAction}>
          <Flow mode="grid" minColumnWidth={220}>
            <Field label="Название" error={errors.name} required>
              <Input
                name="name"
                value={values.name}
                onChange={event => updateValue("name", event.currentTarget.value)}
              />
            </Field>
            <Field label="Email подрядчика">
              <Input
                name="email"
                type="email"
                value={values.email}
                placeholder="name@company.ru"
                onChange={event => updateValue("email", event.currentTarget.value)}
              />
            </Field>
            <Field label="Площадь, м2" error={errors.area} required>
              <NumberInput
                name="area"
                value={values.area}
                onChange={value => updateValue("area", value)}
              />
            </Field>
            <Field label="Срок проверки" error={errors.dueDate} required>
              <DateInput
                name="dueDate"
                value={values.dueDate}
                onChange={value => updateValue("dueDate", value)}
              />
            </Field>
          </Flow>
          <Field label="Статус" error={errors.status} required>
            <Select
              name="status"
              value={values.status}
              onValueChange={value => updateValue("status", value)}
              options={[
                { label: "В работе", value: "work", description: "бригада сейчас на объекте", tone: "success" },
                { label: "Проверка", value: "review", description: "нужна приемка", tone: "warning" },
                { label: "Готово", value: "done", description: "можно закрывать", tone: "default" }
              ]}
            />
          </Field>
          <Checkbox
            name="showOnMap"
            label="Показывать на карте"
            checked={values.showOnMap}
            onChange={event => updateValue("showOnMap", event.currentTarget.checked)}
          />
          <Field label="Комментарий">
            <Textarea
              name="comment"
              value={values.comment}
              onChange={event => updateValue("comment", event.currentTarget.value)}
            />
          </Field>
        </Form>
      </Modal>
      <Modal
        open={noTitleOpen}
        width={420}
        onClose={() => setNoTitleOpen(false)}
        footer={<Button onClick={() => setNoTitleOpen(false)}>Понятно</Button>}
      >
        <Flow gap={8}>
          <strong>Сохранить черновик?</strong>
          <span>Вариант без заголовка сохраняет кнопку закрытия справа.</span>
        </Flow>
      </Modal>
    </div>
  );
}

type ModalFormValues = {
  name: string;
  email: string;
  area: number | "";
  dueDate: string;
  status: string;
  showOnMap: boolean;
  comment: string;
};

type ModalFormErrors = Partial<Record<keyof ModalFormValues, string>>;

type ModalFormState = {
  values?: Partial<ModalFormValues>;
  errors?: ModalFormErrors;
  formError?: string;
  success?: boolean;
};

const initialModalFormState: ModalFormState = {};

const getModalFormValues = (formData: FormData): ModalFormValues  => {
  const areaValue = String(formData.get("area") ?? "");

  return {
    area: areaValue === "" ? "" : Number(areaValue),
    comment: String(formData.get("comment") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    showOnMap: formData.get("showOnMap") === "on",
    status: String(formData.get("status") ?? "")
  };
}

const validateModalForm = (values: ModalFormValues): ModalFormErrors  => {
  const errors: ModalFormErrors = {};

  if (!values.name.trim()) errors.name = "Укажите название.";
  if (values.area === "" || values.area <= 0) errors.area = "Укажите площадь больше 0.";
  if (!values.dueDate) errors.dueDate = "Выберите срок проверки.";
  if (!values.status) errors.status = "Выберите статус.";

  return errors;
}
