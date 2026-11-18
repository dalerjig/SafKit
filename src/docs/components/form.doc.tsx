import { Field, Flow, Form, Input, SubmitButton, Textarea, useFormAction } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

type DemoFormState = {
  values?: {
    name?: string;
    comment?: string;
  };
  errors?: {
    name?: string;
  };
  formError?: string;
  message?: string;
  success?: boolean;
};

const initialDemoState: DemoFormState = {
  values: {
    name: "Котлован 01",
    comment: "Проверить отметки после съемки."
  }
};

const saveDemoForm = async (_previousState: DemoFormState, formData: FormData): Promise<DemoFormState>  => {
  const name = String(formData.get("name") ?? "");
  const comment = String(formData.get("comment") ?? "");

  await new Promise(resolve => window.setTimeout(resolve, 420));

  if (!name.trim()) {
    return {
      values: { name, comment },
      errors: { name: "Название обязательно" },
      formError: "Проверьте поля формы",
      success: false
    };
  }

  return {
    values: { name, comment },
    message: "Сохранено",
    success: true
  };
}

export const getFormDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "form",
    name: "Form",
    importCode: 'import { Field, Form, SubmitButton, useFormAction } from "@ShKit";',
    description:
      "Тонкий form layer для React 19: native form/action, вертикальный layout, Field для label/error и SubmitButton через useFormStatus.",    props: [
      { name: "Form.footer", type: "ReactNode", description: "Опциональная зона действий." },
      { name: "Form.footerSticky", type: "boolean", defaultValue: "false", description: "Фиксирует footer у нижней границы scroll-контейнера для длинных форм." },
      { name: "Form.gap", type: "number | CSS gap", defaultValue: "12", description: "Расстояние между элементами формы, работает как gap у Flow." },
      { name: "Field.label", type: "ReactNode", description: "Подпись поля." },
      { name: "Field.error/hint", type: "ReactNode", description: "Ошибка или подсказка под control." },
      { name: "SubmitButton.pendingText", type: "ReactNode", description: "Текст во время отправки." },
      { name: "useFormAction", type: "(action, initialState) => state", description: "Hook поверх React 19 useActionState." }
    ],    usageCode: `const { state, errors, formAction } = useFormAction(saveObject, initialState);

<Form action={formAction} footer={<SubmitButton>Сохранить</SubmitButton>}>
  <Field label="Название" error={errors.name} required>
    <Input name="name" defaultValue={state.values?.name} />
  </Field>
</Form>`,
    preview: <FormPreview styles={styles} />
  };
}

const FormPreview = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const { errors, formAction, formError, message, state } = useFormAction(saveDemoForm, initialDemoState);

  return (
    <Form
      action={formAction}
      className={styles.previewNarrow}
      footer={<SubmitButton pendingText="Сохраняем..." variant="primary">Сохранить</SubmitButton>}
    >
      <Flow mode="grid" minColumnWidth={180}>
        <Field label="Название" error={errors.name} required>
          <Input name="name" defaultValue={state.values?.name} />
        </Field>
        <Field label="Код">
          <Input name="code" defaultValue="EX-01" />
        </Field>
      </Flow>
      <Field label="Комментарий" hint={message ?? formError}>
        <Textarea name="comment" defaultValue={state.values?.comment} />
      </Field>
    </Form>
  );
}
