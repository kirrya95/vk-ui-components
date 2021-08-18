import React, {
  useState,
  KeyboardEvent,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { HasAlign, HasRef, HasRootRef } from '../../types';
import FormField, { FormFieldProps } from '../FormField/FormField';
import { classNames } from '../../lib/classNames';
import Chip, { ChipProps } from '../Chip/Chip';
import { noop } from '../../lib/utils';
import { useChipsInput } from './useChipsInput';
import { useAdaptivity } from '../../hooks/useAdaptivity';
import { prefixClass } from '../../lib/prefixClass';
import { useExternRef } from '../../hooks/useExternRef';
import './ChipsInput.css';

export type ChipsInputValue = string | number;

export interface ChipsInputOption {
  value?: ChipsInputValue;
  label?: string;
  [otherProp: string]: any;
}

export interface RenderChip<Option extends ChipsInputOption> extends ChipProps {
  label: string;
  option: Option;
  disabled: boolean;
}

export interface ChipsInputProps<Option extends ChipsInputOption> extends
  Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
  HasRef<HTMLInputElement>,
  HasRootRef<HTMLDivElement>,
  HasAlign,
  FormFieldProps {
  value: Option[];
  inputValue?: string;
  onChange?: (o: Option[]) => void;
  onInputChange?: (e?: ChangeEvent<HTMLInputElement>) => void;
  getOptionValue?: (o?: Option) => ChipsInputValue;
  getOptionLabel?: (o?: Option) => string;
  getNewOptionData?: (v?: ChipsInputValue, l?: string) => Option;
  renderChip?: (props?: RenderChip<Option>) => ReactNode;
}

const ChipsInput = <Option extends ChipsInputOption>(props: ChipsInputProps<Option>) => {
  const { style, value, onChange, onInputChange, onKeyDown, onBlur, onFocus, children, className, inputValue,
    getRef, getRootRef, placeholder, getOptionValue, getOptionLabel, getNewOptionData, renderChip,
    after, ...restProps } = props;
  const { sizeY } = useAdaptivity();
  const [focused, setFocused] = useState(false);
  const { fieldValue, addOptionFromInput, removeOption, selectedOptions, handleInputChange } = useChipsInput(props);
  const inputRef = useExternRef(getRef);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || restProps.readOnly) {
      e.preventDefault();
      return;
    }

    onKeyDown(e);

    if (e.key === 'Backspace' && !e.defaultPrevented && !fieldValue && selectedOptions.length) {
      removeOption(getOptionValue(selectedOptions[selectedOptions.length - 1]));
      e.preventDefault();
    }

    if (e.key === 'Enter' && !e.defaultPrevented && fieldValue) {
      addOptionFromInput();
      e.preventDefault();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (focused) {
      setFocused(false);
    }
    onBlur(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!focused) {
      setFocused(true);
    }
    onFocus(e);
  };

  const handleChipRemove = (_: MouseEvent<HTMLInputElement>, value: ChipsInputValue) => {
    removeOption(value);
  };

  return (
    <FormField
      getRootRef={getRootRef}
      vkuiClass={classNames('ChipsInput', `ChipsInput--sizeY-${sizeY}`, {
        'ChipsInput--focused': focused,
        'ChipsInput--withChips': !!selectedOptions.length,
      })}
      className={className}
      style={style}
      disabled={restProps.disabled}
      after={after}
    >
      <div vkuiClass="ChipsInput__container">
        {selectedOptions.map((option: Option) => {
          const value = getOptionValue(option);
          const label = getOptionLabel(option);

          return (
            <React.Fragment key={value}>
              {renderChip({ option, value, label, onRemove: handleChipRemove, disabled: restProps.disabled, className: prefixClass('ChipsInput__chip') })}
            </React.Fragment>
          );
        })}
        <label vkuiClass="ChipsInput__input-container">
          <input
            ref={inputRef}
            value={fieldValue}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-autocomplete="list"
            vkuiClass="ChipsInput__el"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={selectedOptions.length ? null : placeholder}
            {...restProps}
          />
        </label>
      </div>
    </FormField>
  );
};

export const chipsInputDefaultProps: ChipsInputProps<any> = {
  type: 'text',
  onChange: noop,
  onInputChange: noop,
  onKeyDown: noop,
  onBlur: noop,
  onFocus: noop,
  value: [],
  inputValue: '',
  getOptionValue: (option: ChipsInputOption): ChipsInputValue => option.value,
  getOptionLabel: (option: ChipsInputOption): string => option.label,
  getNewOptionData: (_: ChipsInputValue, label: string): ChipsInputOption => ({ value: label, label }),
  renderChip({ disabled, value, label, ...rest }: RenderChip<ChipsInputOption>) {
    return <Chip value={value}
      removable={!disabled}
      {...rest}
    >{label}</Chip>;
  },
};
ChipsInput.defaultProps = chipsInputDefaultProps;

export default ChipsInput;
