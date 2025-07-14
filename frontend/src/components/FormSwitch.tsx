import { chakra, Switch } from "@chakra-ui/react"
import { InputHTMLAttributes } from "preact/compat"
import { Controller } from "react-hook-form"

type FormSwitchProps = {
    name: string
    control: any
    children: any
    disabled?: boolean
}

export const FormSwitch = chakra(({ name, control, children, disabled=false, ...other }: FormSwitchProps) => {
    return <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <Switch.Root
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                disabled={disabled}
                {...other}
            >
                <Switch.HiddenInput onBlur={field.onBlur} />
                <Switch.Control />
                <Switch.Label>{children}</Switch.Label>
            </Switch.Root>
        )}
    />
})