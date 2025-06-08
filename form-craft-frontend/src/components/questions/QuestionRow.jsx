import React, { useState } from "react";
import {
  Box,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Collapse,
  Typography,
  Divider,
} from "@mui/material";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// We expect props:
//   index        → numeric index in the field array
//   control      → from react-hook-form
//   remove       → function to remove this index
//   totalCount   → total number of questions (for 'order' calculation, if needed)
export default function QuestionRow({ index, control, remove }) {
  const [open, setOpen] = useState(true);

  // fieldNamePrefix is “questions[index]”
  const fieldName = (name) => `questions[${index}].${name}`;

  return (
    <Box
      mb={2}
      p={2}
      border="1px solid #ddd"
      borderRadius={1}
      position="relative"
    >
      <IconButton
        size="small"
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={() => remove(index)}
      >
        <RemoveCircleOutlineIcon color="error" />
      </IconButton>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setOpen((prev) => !prev)}
        sx={{ cursor: "pointer", mb: 1 }}
      >
        <Typography variant="subtitle1">Question #{index + 1}</Typography>
        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Grid container spacing={2}>
          {/* 1. Type Selector */}
          <Grid item xs={12} sm={4}>
            <Controller
              name={fieldName("type")}
              control={control}
              defaultValue="SHORT_TEXT"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select {...field} label="Type" value={field.value}>
                    <MenuItem value="SHORT_TEXT">Short Text</MenuItem>
                    <MenuItem value="LONG_TEXT">Long Text</MenuItem>
                    <MenuItem value="INTEGER">Integer</MenuItem>
                    <MenuItem value="CHOICE">Choice</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* 2. Title (required) */}
          <Grid item xs={12} sm={8}>
            <Controller
              name={fieldName("title")}
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Question Text"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* 3. Description (optional) */}
          <Grid item xs={12}>
            <Controller
              name={fieldName("description")}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  fullWidth
                  multiline
                  minRows={2}
                />
              )}
            />
          </Grid>

          {/* 4. ShowInList Toggle */}
          <Grid item xs={12}>
            <Controller
              name={fieldName("showInList")}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Show answer in summary"
                />
              )}
            />
          </Grid>

          {/* 5. If type=INTEGER, you could show a small note “Numeric only.” */}
          {/* But no extra inputs needed. */}

          {/* 6. If type=CHOICE, show allowMultiple + up to 4 option fields */}
          <Controller
            name={fieldName("type")}
            control={control}
            render={({ field }) =>
              field.value === "CHOICE" ? (
                <>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={fieldName("allowMultiple")}
                      control={control}
                      defaultValue={false}
                      render={({ field: f2 }) => (
                        <FormControlLabel
                          control={<Checkbox {...f2} checked={f2.value} />}
                          label="Allow multiple selections"
                        />
                      )}
                    />
                  </Grid>
                  {[0, 1, 2, 3].map((optIdx) => (
                    <Grid item xs={12} sm={4} key={optIdx}>
                      <Controller
                        name={fieldName(`options.${optIdx}`)}
                        control={control}
                        defaultValue=""
                        render={({ field: fo, fieldState }) => (
                          <TextField
                            {...fo}
                            label={`Option ${optIdx + 1}`}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={
                              fieldState.error ? fieldState.error.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </>
              ) : null
            }
          />
        </Grid>
      </Collapse>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
