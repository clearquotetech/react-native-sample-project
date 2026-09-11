import { useEffect, useState } from 'react';

import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClearQuoteSDK } from '../ClearQuoteSDK';
import type {
  ClientAttrs,
  InputDetails,
  UserFlowParams,
} from '../types/clear_quote_type';
import type { RootStackParamList } from '../types/navigationTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Inspection'>;

function optionalTrim(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: object;
  compact?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  compact = false,
}: Readonly<FieldProps>) {
  return (
    <View style={style}>
      <Text style={[styles.label, compact && styles.compactLabel]}>{label}</Text>
      <TextInput
        style={[styles.textInput, compact && styles.compactTextInput]}
        placeholder={placeholder}
        placeholderTextColor="black"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

export default function InspectionScreen({ navigation }: Readonly<Props>) {
  const [dealerCode, setDealerCode] = useState<string | null>(null);

  // Client attrs
  const [userName, setUserName] = useState('');
  const [dealer, setDealer] = useState('');
  const [dealerIdentifier, setDealerIdentifier] = useState('');
  const [clientUniqueId, setClientUniqueId] = useState('');
  const [organisationId, setOrganisationId] = useState('');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dialCode, setDialCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Vehicle details
  const [regNumber, setRegNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [variant, setVariant] = useState('');

  // Quote data
  const [inspectionType, setInspectionType] = useState('');
  const [fleetImageType, setFleetImageType] = useState('');

  // User flow params
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    try {
      setDealerCode(ClearQuoteSDK.getDealerCode());
    } catch {
      setDealerCode(null);
    }
  }, []);

  useEffect(() => {
    const subscription = ClearQuoteSDK.addInspectionCompletionListener(status => {
      Alert.alert(
        'Inspection Status',
        [
          `identifier: ${status.identifier}`,
          `message: ${status.message}`,
          `code: ${status.code}`,
          `isOffline: ${status.isOffline}`,
          `serverQuoteId: ${status.serverQuoteId ?? '—'}`,
          `serverInspectionId: ${status.serverInspectionId ?? '—'}`,
        ].join('\n'),
      );
    });

    return () => subscription.remove();
  }, []);

  const buildClientAttrs = (): ClientAttrs => ({
    userName: optionalTrim(userName),
    dealer: optionalTrim(dealer),
    dealerIdentifier: optionalTrim(dealerIdentifier),
    client_unique_id: optionalTrim(clientUniqueId),
    organisationId: optionalTrim(organisationId),
  });

  const buildInputDetails = (): InputDetails => ({
    customerDetails: {
      name: optionalTrim(customerName),
      email: optionalTrim(customerEmail),
      dialCode: optionalTrim(dialCode),
      phoneNumber: optionalTrim(phoneNumber),
    },
    vehicleDetails: {
      regNumber: optionalTrim(regNumber),
      make: optionalTrim(make),
      model: optionalTrim(model),
      bodyStyle: optionalTrim(bodyStyle),
      fuelType: optionalTrim(fuelType),
      variant: optionalTrim(variant),
    },
    quoteData: {
      inspectionType: optionalTrim(inspectionType),
      fleetImageType: optionalTrim(fleetImageType),
    },
  });

  const onStartInspection = async (skipInputPage: boolean) => {
    const userFlowParams: UserFlowParams = {
      isOffline,
      skipInputPage,
    };

    try {
      const {started, message, code} = await ClearQuoteSDK.startInspection(
        buildClientAttrs(),
        buildInputDetails(),
        userFlowParams,
      );
      if (started) { return };

       Alert.alert('Inspection Status', `Started: ${started} \nMessage: ${message} \nCode: ${code}`);

    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Start failed');
    }
  };

  const onLogout = () => {
    try {
      ClearQuoteSDK.logout();
      navigation.replace('Initialize');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Logout failed');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Start Inspection</Text>
        </View>

        <Text style={styles.text}>
          Dealer Code: <Text style={styles.dealerCodeValue}>{dealerCode ?? '—'}</Text>
        </Text>

        <Text style={styles.sectionTitle}>Client Attrs</Text>
        <Field label="User Name (Optional)" value={userName} onChangeText={setUserName} placeholder="userName" />
        <Field label="Dealer (Optional)" value={dealer} onChangeText={setDealer} placeholder="dealer" />
        <Field
          label="Dealer Identifier (Optional)"
          value={dealerIdentifier}
          onChangeText={setDealerIdentifier}
          placeholder="dealerIdentifier"
        />
        <Field
          label="Client Unique ID (Optional)"
          value={clientUniqueId}
          onChangeText={setClientUniqueId}
          placeholder="client_unique_id"
        />
        <Field
          label="Organisation ID (Optional)"
          value={organisationId}
          onChangeText={setOrganisationId}
          placeholder="organisationId"
        />

        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Field
          label="Customer Name (Optional)"
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="name"
          autoCapitalize="words"
        />
        <Field
          label="Customer Email (Optional)"
          value={customerEmail}
          onChangeText={setCustomerEmail}
          placeholder="email"
          keyboardType="email-address"
        />
        <View style={styles.phoneRow}>
          <Field
            label="Dial Code"
            value={dialCode}
            onChangeText={setDialCode}
            placeholder="dialCode"
            keyboardType="phone-pad"
            style={styles.dialCodeField}
            compact
          />
          <Field
            label="Phone Number (Optional)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="phoneNumber"
            keyboardType="phone-pad"
            style={styles.phoneNumberField}
            compact
          />
        </View>

        <Text style={styles.sectionTitle}>Vehicle Details (If Skipping Input in SDK)</Text>
        <Field
          label="Registration Number"
          value={regNumber}
          onChangeText={setRegNumber}
          placeholder="regNumber"
          autoCapitalize="characters"
        />
        <Field label="Make" value={make} onChangeText={setMake} placeholder="make" />
        <Field label="Model" value={model} onChangeText={setModel} placeholder="model" />
        <Field
          label="Body Style"
          value={bodyStyle}
          onChangeText={setBodyStyle}
          placeholder="bodyStyle"
        />
        <Field
          label="Fuel Type"
          value={fuelType}
          onChangeText={setFuelType}
          placeholder="fuelType"
        />
        <Field label="Variant" value={variant} onChangeText={setVariant} placeholder="variant" />

        <Text style={styles.sectionTitle}>Quote Data (If Skipping Input in SDK)</Text>
        <Field
          label="Inspection Type"
          value={inspectionType}
          onChangeText={setInspectionType}
          placeholder="inspectionType"
        />
        <Field
          label="Fleet Image Type"
          value={fleetImageType}
          onChangeText={setFleetImageType}
          placeholder="fleetImageType"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Offline Mode</Text>
          <Switch value={isOffline} onValueChange={setIsOffline} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={() => onStartInspection(false)}
        >
          <Text style={styles.startButtonText}>Start Inspection</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={() => onStartInspection(true)}
        >
          <Text style={styles.startButtonText}>Start Inspection (Skip Input)</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={() => ClearQuoteSDK.manualOfflineSync()}
        >
          <Text style={styles.startButtonText}>Manual Offline Sync</Text>
        </Pressable>

        <View style={styles.button}>
          <Button title="Logout" color="red" onPress={onLogout} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  titleContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  text: {
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  dealerCodeValue: {
    fontWeight: '700',
  },
  label: {
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 16,
    marginHorizontal: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 0,
  },
  compactTextInput: {
    marginHorizontal: 0,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    gap: 12,
  },
  dialCodeField: {
    flex: 0.35,
  },
  phoneNumberField: {
    flex: 0.65,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 4,
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  startButton: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#2AB6B6',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  startButtonPressed: {
    opacity: 0.8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
