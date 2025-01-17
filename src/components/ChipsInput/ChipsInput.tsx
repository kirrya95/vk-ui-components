import { FormField, FormFieldProps } from "../FormField/FormField";
import { ChipOption } from "../Chip/Chip";
import {
  ChipsInputBase,
  ChipsInputBaseProps,
} from "../ChipsInputBase/ChipsInputBase";
import "./ChipsInput.css";

export interface ChipsInputProps<Option extends ChipOption>
  extends ChipsInputBaseProps<Option>,
    FormFieldProps {}

/**
 * @see https://vkcom.github.io/VKUI/#/ChipsInput
 */
export const ChipsInput = <Option extends ChipOption>({
  style,
  className,
  getRootRef,
  before,
  after,
  status,
  ...restProps
}: ChipsInputProps<Option>) => {
  return (
    <FormField
      getRootRef={getRootRef}
      vkuiClass="ChipsInput"
      className={className}
      style={style}
      disabled={restProps.disabled}
      before={before}
      after={after}
      role="application"
      aria-disabled={restProps.disabled}
      aria-readonly={restProps.readOnly}
      status={status}
    >
      <ChipsInputBase {...restProps} />
    </FormField>
  );
};
